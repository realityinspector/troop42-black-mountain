import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../db.js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "EDITOR" | "VIEWER";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return secret;
}

function extractToken(req: Request): string | null {
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  // Fall back to cookie
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
}

/**
 * Middleware that optionally attaches the user to the request if a valid
 * token is present. Does NOT reject unauthenticated requests.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }

    // Dev token shortcut
    const devToken = process.env.AUTH_DEV_TOKEN;
    if (devToken && token === devToken) {
      req.user = {
        id: "dev-admin",
        email: "admin@troop42.org",
        name: "Dev Admin",
        role: "ADMIN",
      };
      return next();
    }

    const payload = jwt.verify(token, getJwtSecret()) as {
      userId: string;
      email: string;
      name: string;
      role: "ADMIN" | "EDITOR" | "VIEWER";
    };

    req.user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch {
    // Invalid token -- treat as unauthenticated
  }

  next();
}

/**
 * Middleware that requires a valid authenticated user.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    // Dev token shortcut
    const devToken = process.env.AUTH_DEV_TOKEN;
    if (devToken && token === devToken) {
      req.user = {
        id: "dev-admin",
        email: "admin@troop42.org",
        name: "Dev Admin",
        role: "ADMIN",
      };
      return next();
    }

    const payload = jwt.verify(token, getJwtSecret()) as {
      userId: string;
      email: string;
      name: string;
      role: "ADMIN" | "EDITOR" | "VIEWER";
    };

    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
      res.status(401).json({ error: "User no longer exists" });
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Middleware that requires the authenticated user to have ADMIN role.
 * Must be used after requireAuth.
 */
export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
}
