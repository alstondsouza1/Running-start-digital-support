import express from "express";
import adminController from "../controllers/adminController.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// Admin Routes

// 1.) Add question
router.post("/addFAQ", adminController.addFaq);
router.get("/getFAQS", adminController.getFaqs);

export default router;