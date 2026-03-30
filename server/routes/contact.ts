import { Router, Request, Response } from "express";
import { z } from "zod";
import prisma from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required").max(300),
  message: z.string().min(1, "Message is required").max(5000),
});

/**
 * POST /api/contact
 * Submit a contact form message. Public.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "Validation failed",
        details: parsed.error.flatten().fieldErrors,
      });
      return;
    }

    const message = await prisma.contactMessage.create({
      data: parsed.data,
    });

    res.status(201).json({
      message: "Thank you for your message. We will get back to you soon!",
      id: message.id,
    });
  } catch (error) {
    console.error("Contact submit error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/contact
 * List all contact messages. Admin only.
 * Query params: read (true/false), page, limit
 */
router.get("/", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { read, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (read === "true") where.read = true;
    if (read === "false") where.read = false;

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.contactMessage.count({ where }),
    ]);

    res.json({
      messages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("List contact messages error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/contact/:id/read
 * Mark a message as read. Admin only.
 */
router.put("/:id/read", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.contactMessage.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      res.status(404).json({ error: "Message not found" });
      return;
    }

    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { read: true },
    });

    res.json({ message });
  } catch (error) {
    console.error("Mark read error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
