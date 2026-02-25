import express from "express";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

export default router;