import { Router, Request, Response } from "express";
import prisma from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

/**
 * GET /api/notifications
 * List active, non-expired notifications. Public.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const now = new Date();

    const notifications = await prisma.notification.findMany({
      where: {
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: now } },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ notifications });
  } catch (error) {
    console.error("List notifications error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/notifications
 * Create a notification. Admin only.
 */
router.post("/", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { title, message, type, active, expiresAt } = req.body;

    if (!title || !message) {
      res.status(400).json({ error: "Title and message are required" });
      return;
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type: type || "INFO",
        active: active ?? true,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json({ notification });
  } catch (error) {
    console.error("Create notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/notifications/:id
 * Update a notification. Admin only.
 */
router.put("/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    const { title, message, type, active, expiresAt } = req.body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (message !== undefined) data.message = message;
    if (type !== undefined) data.type = type;
    if (active !== undefined) data.active = active;
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const notification = await prisma.notification.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ notification });
  } catch (error) {
    console.error("Update notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/notifications/:id
 * Delete a notification. Admin only.
 */
router.delete("/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.notification.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    await prisma.notification.delete({ where: { id: req.params.id } });
    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
