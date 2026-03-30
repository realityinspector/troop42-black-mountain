import { Router, Request, Response } from "express";
import prisma from "../db.js";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth.js";

const router = Router();

/**
 * Generate a URL-safe slug from a title, ensuring uniqueness.
 */
async function generateUniqueSlug(title: string, existingId?: string): Promise<string> {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  let slug = base;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === existingId) break;
    slug = `${base}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * GET /api/posts
 * List posts. Public users see only published posts. Auth users see all.
 * Query params: category, page, limit
 */
router.get("/", optionalAuth, async (req: Request, res: Response) => {
  try {
    const { category, page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};

    // Non-authenticated users only see published posts
    if (!req.user) {
      where.published = true;
    }

    if (category && ["BLOG", "SCOUTMASTER_NOTE", "ANNOUNCEMENT"].includes(category as string)) {
      where.category = category;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { author: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      posts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("List posts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/posts/:slug
 * Get a single post by slug. Non-auth users can only see published posts.
 */
router.get("/:slug", optionalAuth, async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    if (!post.published && !req.user) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({ post });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/posts
 * Create a new post. Auth required.
 */
router.post("/", requireAuth, async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, category, published, featuredImage } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required" });
      return;
    }

    const slug = await generateUniqueSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        category: category || "BLOG",
        published: published ?? false,
        featuredImage: featuredImage || null,
        authorId: req.user!.id,
      },
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PUT /api/posts/:id
 * Update a post. Auth required.
 */
router.put("/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const { title, content, excerpt, category, published, featuredImage } = req.body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) {
      data.title = title;
      data.slug = await generateUniqueSlug(title, existing.id);
    }
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt || null;
    if (category !== undefined) data.category = category;
    if (published !== undefined) data.published = published;
    if (featuredImage !== undefined) data.featuredImage = featuredImage || null;

    const post = await prisma.post.update({
      where: { id: req.params.id },
      data,
      include: { author: { select: { id: true, name: true, email: true } } },
    });

    res.json({ post });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/posts/:id
 * Delete a post. Admin only.
 */
router.delete("/:id", requireAuth, requireAdmin, async (req: Request, res: Response) => {
  try {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } });
    if (!existing) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    await prisma.post.delete({ where: { id: req.params.id } });
    res.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
