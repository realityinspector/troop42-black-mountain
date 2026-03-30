import express from "express";
import compression from "compression";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import eventRoutes from "./routes/events.js";
import contactRoutes from "./routes/contact.js";
import notificationRoutes from "./routes/notifications.js";
import resourceRoutes from "./routes/resources.js";
import aiRoutes from "./routes/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3042", 10);
const isProd = process.env.NODE_ENV === "production";

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(compression());
app.use(
  cors({
    origin: isProd
      ? process.env.CORS_ORIGIN || "https://troop42blackmountain.org"
      : ["http://localhost:5173", "http://localhost:3042"],
    credentials: true,
  })
);
app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/ai", aiRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Static files & SPA fallback (production only)
// ---------------------------------------------------------------------------
if (isProd) {
  const distPath = path.resolve(__dirname, "../dist");

  // Cache hashed assets (JS/CSS) for 1 day, but never cache index.html
  app.use(express.static(distPath, {
    maxAge: "1d",
    setHeaders(res, filePath) {
      if (filePath.endsWith(".html")) {
        res.setHeader("Cache-Control", "no-cache");
      }
    },
  }));

  // SPA fallback: serve index.html for any non-API route (no-cache)
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// ---------------------------------------------------------------------------
// 404 handler for API routes
// ---------------------------------------------------------------------------
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
      error: isProd ? "Internal server error" : err.message,
    });
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${isProd ? "production" : "development"}`);
});

export default app;
