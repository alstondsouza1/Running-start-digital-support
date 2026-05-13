import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { testConnection } from "./db/db.js";
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

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Running Start backend is working");
});

app.use("/api", router);
app.use("/api/auth", authenticateRoutes);

app.use((err, _req, res, next) => {
  if (err?.message?.startsWith("CORS blocked for origin:")) {
    return res.status(403).json({ error: "Origin not allowed by CORS" });
  }

  return next(err);
});

app.listen(PORT, async () => {
  await testConnection();
  console.log(`Listening on http://localhost:${PORT}`);
});