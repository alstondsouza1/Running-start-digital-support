import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { testConnection } from "./db/db.js";
import { runMigrations } from "./migrations/index.js";
import router from "./router/router.js";
import authenticateRoutes from "./router/authenticateRoutes.js";

const app = express();
const PORT = Number(process.env.PORT || 5001);

const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:5173,https://running-start-portal.vercel.app"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: false,
  })
);

app.use(express.json({ limit: "1mb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please wait and try again.",
  },
});

app.get("/", (_req, res) => {
  res.send("Running Start backend is working");
});

app.use("/api/auth", loginLimiter, authenticateRoutes);
app.use("/api", router);

app.use((err, _req, res, next) => {
  if (err?.message?.startsWith("CORS blocked for origin:")) {
    return res.status(403).json({ error: "Origin not allowed by CORS" });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({ error: "Server error" });
});

async function startServer() {
  await testConnection();
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Server startup failed:", err.message);
  process.exit(1);
});
