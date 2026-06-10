import express from "express";
import adminController from "../controllers/adminController.js";
import requireAdmin from "../middleware/requireAdmin.js";
import { checkDatabaseHealth } from "../db/db.js";

const router = express.Router();

router.get("/health", async (_req, res) => {
  try {
    const databaseOk = await checkDatabaseHealth();

    if (!databaseOk) {
      return res.status(503).json({
        ok: false,
        api: "running",
        database: "unavailable",
      });
    }

    return res.json({
      ok: true,
      api: "running",
      database: "connected",
    });
  } catch {
    return res.status(503).json({
      ok: false,
      api: "running",
      database: "unavailable",
    });
  }
});

// public read
router.get("/getFAQS", adminController.getFaqs);
router.get("/categories", adminController.getFaqCategories);
router.get("/admin/faq", requireAdmin, adminController.getFaqs);

// admin FAQ CRUD
router.post("/addFAQ", requireAdmin, adminController.addFaq);
router.put("/faq/order", requireAdmin, adminController.updateFaqOrder);
router.put("/faq/:id/visibility", requireAdmin, adminController.updateFaqVisibility);
router.put("/faq/:id", requireAdmin, adminController.updateFaq);
router.delete("/faq/:id", requireAdmin, adminController.deleteFaq);

// admin category CRUD
router.post("/categories", requireAdmin, adminController.addCategory);
router.put("/categories/order", requireAdmin, adminController.updateCategoryOrder);
router.put("/categories/:audience/:id", requireAdmin, adminController.updateCategory);
router.delete("/categories/:audience/:id", requireAdmin, adminController.deleteCategory);

export default router;
