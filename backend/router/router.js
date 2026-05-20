import express from "express";
import adminController from "../controllers/adminController.js";
import requireAdmin from "../middleware/requireAdmin.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// public read
router.get("/getFAQS", adminController.getFaqs);
router.get("/categories", adminController.getFaqCategories);

// admin FAQ CRUD
router.post("/addFAQ", requireAdmin, adminController.addFaq);
router.put("/faq/order", requireAdmin, adminController.updateFaqOrder);
router.put("/faq/:id", requireAdmin, adminController.updateFaq);
router.delete("/faq/:id", requireAdmin, adminController.deleteFaq);

// admin category CRUD
router.post("/categories", requireAdmin, adminController.addCategory);
router.put("/categories/order", requireAdmin, adminController.updateCategoryOrder);
router.put("/categories/:audience/:id", requireAdmin, adminController.updateCategory);
router.delete("/categories/:audience/:id", requireAdmin, adminController.deleteCategory);

export default router;