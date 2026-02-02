import { Router } from "express";

const router = Router();

// Basic health route
router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

export default router;