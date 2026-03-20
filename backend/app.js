import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { testConnection } from "./db/db.js";
import router from "./router/router.js";
import authenticateRoutes from "./router/authenticateRoutes.js";

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://running-start-portal.vercel.app"
];

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

app.get("/", (req, res) => {
  res.send("Running Start backend is working");
});

app.use("/api", router);
app.use("/api/auth", authenticateRoutes);

app.listen(PORT, async () => {
  await testConnection();
  console.log(`Listening on http://localhost:${PORT}`);
});