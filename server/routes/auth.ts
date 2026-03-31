import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../db.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

function signToken(user: { id: string; email: string; name: string; role: string }): string {
  return jwt.sign(
    { userId: user.id, email: user.email, name: user.name, role: user.role },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

/**
 * POST /api/auth/login
 * Accept email+password OR dev token.
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { email, password, devToken } = body;

    // Dev token login
    if (devToken) {
      const envDevToken = process.env.AUTH_DEV_TOKEN;
      if (!envDevToken || devToken !== envDevToken) {
        res.status(401).json({ error: "Invalid dev token" });
        return;
      }

      // Find or acknowledge the admin user for dev mode
      const adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
      });

      const token = adminUser
        ? signToken(adminUser)
        : signToken({
            id: "dev-admin",
            email: "admin@troop42.org",
            name: "Dev Admin",
            role: "ADMIN",
          });

      res.json({
        token,
        user: adminUser ?? {
          id: "dev-admin",
          email: "admin@troop42.org",
          name: "Dev Admin",
          role: "ADMIN",
        },
      });
      return;
    }

    // Email + password login
    if (!email || !password) {
      console.log("Login: no devToken or email in body. Keys:", Object.keys(body), "Content-Type:", req.headers["content-type"]);
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/auth/register
 * Admin-only in production, open in development.
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required" });
      return;
    }

    // In production, only admins can register new users
    if (process.env.NODE_ENV === "production") {
      // Check for auth token
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : req.cookies?.token;

      if (!token) {
        res.status(403).json({ error: "Registration requires admin access in production" });
        return;
      }

      try {
        const payload = jwt.verify(token, getJwtSecret()) as { role: string };
        if (payload.role !== "ADMIN") {
          res.status(403).json({ error: "Only admins can register new users" });
          return;
        }
      } catch {
        res.status(403).json({ error: "Invalid token" });
        return;
      }
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: role === "ADMIN" || role === "EDITOR" ? role : "VIEWER",
      },
      select: { id: true, email: true, name: true, role: true },
    });

    const jwtToken = signToken(user);

    res.status(201).json({ token: jwtToken, user });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/auth/me
 * Return the currently authenticated user.
 */
router.get("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.error("Me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/auth/google - Google OAuth stub
 */
router.get("/google", (_req: Request, res: Response) => {
  res.status(501).json({ error: "Google OAuth coming soon" });
});

/**
 * GET /api/auth/google/callback - Google OAuth callback stub
 */
router.get("/google/callback", (_req: Request, res: Response) => {
  res.status(501).json({ error: "Google OAuth coming soon" });
});

export default router;
