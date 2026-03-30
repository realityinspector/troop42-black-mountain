import { Router, Request, Response } from "express";
import prisma from "../db.js";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth.js";

const router = Router();

async function generateUniqueSlug(title: string, existingId?: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (!existing || existing.id === existingId) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * GET /api/events
 * List events. Filter by date range and category.
 * Query params: category, startAfter, startBefore, page, limit
 */
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category, startAfter, startBefore, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (!req.user) {
      where.published = true;
    }

    if (category && ["MEETING", "CAMPOUT", "SERVICE", "FUNDRAISER", "SPECIAL"].includes(category as string)) {
      where.category = category;
    }

    if (startAfter || startBefore) {
      const startDateFilter: Record<string, Date> = {};
      if (startAfter) startDateFilter.gte = new Date(startAfter as string);
      if (startBefore) startDateFilter.lte = new Date(startBefore as string);
      where.startDate = startDateFilter;
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { startDate: "asc" },
        skip,
        take: limitNum,
      }),
      prisma.event.count({ where }),
    ]);

    res.json({
      events,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("List events error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/events/:slug
 * Get a single event by slug.
 */
router.get("/:slug", optionalAuth, async (req: Request, res: Response) => {
  try {
    const event = await prisma.event.findUnique({
      where: { slug: req.params.slug },
    });

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    if (!event.published && !req.user) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ event });
  } catch (error) {
    console.error("Get event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/events
 * Create a new event. Auth required.
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { title, description, location, startDate, endDate, allDay, category, published } = req.body;

    if (!title || !description || !startDate) {
      res.status(400).json({ error: "Title, description, and startDate are required" });
      return;
    }

    const slug = await generateUniqueSlug(title);

    const event = await prisma.event.create({
      data: {
        title,
        slug,
        description,
        location: location || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        allDay: allDay ?? false,
        category: category || "MEETING",
        published: published ?? false,
      },
    });

    res.status(201).json({ event });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/events/:id
 * Update an event. Auth required.
 */
router.put("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    const { title, description, location, startDate, endDate, allDay, category, published } = req.body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) {
      data.title = title;
      data.slug = await generateUniqueSlug(title, existing.id);
    }
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location || null;
    if (startDate !== undefined) data.startDate = new Date(startDate);
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (allDay !== undefined) data.allDay = allDay;
    if (category !== undefined) data.category = category;
    if (published !== undefined) data.published = published;

    const event = await prisma.event.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ event });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/events/:id
 * Delete an event. Admin only.
 */
router.delete("/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    await prisma.event.delete({ where: { id: req.params.id } });
    res.json({ message: "Event deleted" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
