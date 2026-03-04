import express from "express";
import router from "./router/router.js";
import cors from "cors";
import { testConnection } from "./db/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, async () => {
  await testConnection();
  console.log(`Listening on http://localhost:${PORT}`);
});