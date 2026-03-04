import express from "express";
import adminController from "../controllers/adminController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

router.get("/getFAQS", adminController.getFaqs);

router.post("/addFAQ", requireAdmin, adminController.addFaq);

export default router;