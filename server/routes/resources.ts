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
    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (!existing || existing.id === existingId) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * GET /api/resources
 * List resources. Filter by category. Public users see published only.
 * Query params: category, page, limit
 */
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category, page = "1", limit = "50" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 50));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    if (!req.user) {
      where.published = true;
    }

    if (
      category &&
      ["PACKING_LIST", "GEAR_GUIDE", "MERIT_BADGE", "GENERAL"].includes(category as string)
    ) {
      where.category = category;
    }

    const [resources, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        skip,
        take: limitNum,
      }),
      prisma.resource.count({ where }),
    ]);

    res.json({
      resources,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("List resources error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/resources/:slug
 * Get a single resource by slug.
 */
router.get("/:slug", optionalAuth, async (req: Request, res: Response) => {
  try {
    const resource = await prisma.resource.findUnique({
      where: { slug: req.params.slug },
    });

    if (!resource) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    if (!resource.published && !req.user) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    res.json({ resource });
  } catch (error) {
    console.error("Get resource error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/resources
 * Create a new resource. Auth required.
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { title, content, category, sortOrder, published } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }

    const slug = await generateUniqueSlug(title);

    const resource = await prisma.resource.create({
      data: {
        title,
        slug,
        content,
        category: category || "GENERAL",
        sortOrder: sortOrder ?? 0,
        published: published ?? false,
      },
    });

    res.status(201).json({ resource });
  } catch (error) {
    console.error("Create resource error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/resources/:id
 * Update a resource. Auth required.
 */
router.put("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.resource.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    const { title, content, category, sortOrder, published } = req.body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) {
      data.title = title;
      data.slug = await generateUniqueSlug(title, existing.id);
    }
    if (content !== undefined) data.content = content;
    if (category !== undefined) data.category = category;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;
    if (published !== undefined) data.published = published;

    const resource = await prisma.resource.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ resource });
  } catch (error) {
    console.error("Update resource error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/resources/:id
 * Delete a resource. Admin only.
 */
router.delete("/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.resource.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: "Resource not found" });
      return;
    }

    await prisma.resource.delete({ where: { id: req.params.id } });
    res.json({ message: "Resource deleted" });
  } catch (error) {
    console.error("Delete resource error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
