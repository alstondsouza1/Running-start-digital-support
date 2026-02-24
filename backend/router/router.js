import { Router } from "express";
import requireAdmin from "../middleware/requireAdmin.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// optional: test protected route
router.get("/admin/test", requireAdmin, (req, res) => {
  res.json({ ok: true, message: "Admin access confirmed", user: req.user });
});

export default router;