import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import router from "./router/router.js"; // health or other routes
import autheticateRoutes from "./router/authenticateRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount all API routes under /api
app.use("/api", router);
app.use("/api", autheticateRoutes);

// Optional root test route
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});