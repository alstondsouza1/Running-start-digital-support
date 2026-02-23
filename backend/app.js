import dotenv from "dotenv";
dotenv.config();

import express from "express";
import router from "./router/router.js";
import cors from "cors";

import autheticateRoutes from "./router/authenticateRoutes.js"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/api", router);
app.use("/", autheticateRoutes)

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});