import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { testConnection } from "./db/db.js";

import router from "./router/router.js";
import authenticateRoutes from "./router/authenticateRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api", router);
app.use("/api/auth", authenticateRoutes);

app.get("/", (req, res) => res.send("Hello"));

app.listen(PORT, async () => {
  await testConnection();
  console.log(`Listening on http://localhost:${PORT}`);
});