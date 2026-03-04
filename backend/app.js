import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { testConnection } from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

import router from "./router/router.js";
import authenticateRoutes from "./router/authenticateRoutes.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Mount all API routes under /api
app.use("/api", router);

app.use("/api/auth", authenticateRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, async () => {
  await testConnection();
  console.log(`Listening on http://localhost:${PORT}`);
});