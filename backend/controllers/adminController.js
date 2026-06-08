import pool from "../db/db.js";

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function parseAnswer(answerValue) {
  if (typeof answerValue === "object" && answerValue !== null) {
    return answerValue;
  }

  if (typeof answerValue === "string") {
    try {
      return JSON.parse(answerValue);
    } catch {
      return { bullets: [] };
    }
  }

  return { bullets: [] };
}

function normalizeAnswer(answer) {
  if (!answer || typeof answer !== "object") {
    return { error: "answer is required and must be an object" };
  }

  const intro = typeof answer.intro === "string" ? answer.intro.trim() : "";

  if (!Array.isArray(answer.bullets)) {
    return { error: "answer.bullets must be an array" };
  }

  const bullets = [];

  for (const bullet of answer.bullets) {
    const text = typeof bullet?.text === "string" ? bullet.text.trim() : "";
    const rawUrl = typeof bullet?.url === "string" ? bullet.url.trim() : "";

    if (!text) continue;

    const cleanedBullet = { text };

    if (rawUrl) {
      const finalUrl = normalizeUrl(rawUrl);

      if (!isValidHttpUrl(finalUrl)) {
        return { error: "Each bullet URL must be a valid http or https URL" };
      }

      cleanedBullet.url = finalUrl;
    }

    bullets.push(cleanedBullet);
  }

  if (bullets.length === 0) {
    return { error: "answer.bullets must contain at least one valid bullet" };
  }

  return {
    value: {
      ...(intro ? { intro } : {}),
      bullets,
    },
  };
}

function createCategoryId(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function categoryNameExists(audience, name, excludeId = "") {
  const normalizedName = createCategoryId(name);

  if (!normalizedName) return false;

  const [rows] = await pool.query(
    "SELECT id, name FROM categories WHERE audience = ?",
    [audience]
  );

  return rows.some((row) => {
    if (excludeId && row.id === excludeId) return false;
    return createCategoryId(row.name) === normalizedName;
  });
}

async function getValidCategoryIds(audience) {
  const [rows] = await pool.query(
    "SELECT id FROM categories WHERE audience = ?",
    [audience]
  );

  return rows.map((row) => row.id);
}

async function resequenceFaqs(audience, type) {
  const [rows] = await pool.query(
    `SELECT id
     FROM faq
     WHERE audience = ? AND type = ?
     ORDER BY sort_order, created_at, id`,
    [audience, type]
  );

  for (let i = 0; i < rows.length; i += 1) {
    await pool.query("UPDATE faq SET sort_order = ? WHERE id = ?", [
      i + 1,
      rows[i].id,
    ]);
  }
}

async function validateFaqInput({ audience, type, question, answer }) {
  const trimmedAudience = typeof audience === "string" ? audience.trim() : "";
  const trimmedType = typeof type === "string" ? type.trim() : "";
  const trimmedQuestion = typeof question === "string" ? question.trim() : "";

  if (!trimmedAudience || !trimmedType || !trimmedQuestion || !answer) {
    return {
      error: "audience, type, question, and answer are required",
    };
  }

  if (!["current", "future"].includes(trimmedAudience)) {
    return { error: "Invalid audience value" };
  }

  const allowedCategoryIds = await getValidCategoryIds(trimmedAudience);

  if (!allowedCategoryIds.includes(trimmedType)) {
    return { error: "Invalid category for the selected audience" };
  }

  const normalizedAnswer = normalizeAnswer(answer);

  if (normalizedAnswer.error) {
    return { error: normalizedAnswer.error };
  }

  return {
    value: {
      audience: trimmedAudience,
      type: trimmedType,
      question: trimmedQuestion,
      answer: normalizedAnswer.value,
    },
  };
}

export const getFaqs = async (req, res) => {
  try {
    const audience =
      typeof req.query.audience === "string" ? req.query.audience.trim() : "";

    if (!audience) {
      return res
        .status(400)
        .json({ error: "audience query parameter is required" });
    }

    if (!["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    const includeHidden = req.user?.role === "admin";
    const visibilityClause = includeHidden ? "" : "AND is_published = TRUE";

    const [rows] = await pool.query(
      `SELECT id, audience, type, question, answer, is_published, sort_order, created_at, updated_at
       FROM faq
       WHERE audience = ?
       ${visibilityClause}
       ORDER BY type, sort_order, created_at, id`,
      [audience]
    );

    const formatted = rows.map((row) => ({
      id: row.id,
      audience: row.audience,
      type: row.type,
      sort_order: row.sort_order,
      is_published: Boolean(row.is_published),
      created_at: row.created_at,
      updated_at: row.updated_at,
      question: row.question,
      answer: parseAnswer(row.answer),
    }));

    return res.json(formatted);
  } catch (err) {
    console.error("Get FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addFaq = async (req, res) => {
  try {
    const validated = await validateFaqInput(req.body);

    if (validated.error) {
      return res.status(400).json({ error: validated.error });
    }

    const { audience, type, question, answer } = validated.value;
    const isPublished =
      typeof req.body.is_published === "boolean" ? req.body.is_published : true;

    const [maxRows] = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM faq WHERE audience = ? AND type = ?",
      [audience, type]
    );

    const nextSort = (maxRows?.[0]?.maxSort ?? 0) + 1;

    const [result] = await pool.query(
      "INSERT INTO faq (audience, type, question, answer, is_published, sort_order) VALUES (?, ?, ?, ?, ?, ?)",
      [audience, type, question, JSON.stringify(answer), isPublished, nextSort]
    );

    return res.status(201).json({
      message: "FAQ added successfully",
      id: result.insertId,
      sort_order: nextSort,
    });
  } catch (err) {
    console.error("Add FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Valid FAQ id is required" });
    }

    const validated = await validateFaqInput(req.body);

    if (validated.error) {
      return res.status(400).json({ error: validated.error });
    }

    const { audience, type, question, answer } = validated.value;

    const [existingRows] = await pool.query(
      "SELECT id, audience, type, sort_order, is_published FROM faq WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    const existing = existingRows[0];
    const isPublished =
      typeof req.body.is_published === "boolean"
        ? req.body.is_published
        : Boolean(existing.is_published);
    let sortOrder = existing.sort_order;

    const movedToDifferentGroup =
      existing.audience !== audience || existing.type !== type;

    if (movedToDifferentGroup) {
      const [maxRows] = await pool.query(
        "SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM faq WHERE audience = ? AND type = ?",
        [audience, type]
      );

      sortOrder = (maxRows?.[0]?.maxSort ?? 0) + 1;
    }

    await pool.query(
      `UPDATE faq
       SET audience = ?, type = ?, question = ?, answer = ?, is_published = ?, sort_order = ?
       WHERE id = ?`,
      [audience, type, question, JSON.stringify(answer), isPublished, sortOrder, id]
    );

    if (movedToDifferentGroup) {
      await resequenceFaqs(existing.audience, existing.type);
      await resequenceFaqs(audience, type);
    }

    return res.json({ message: "FAQ updated successfully" });
  } catch (err) {
    console.error("Update FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateFaqVisibility = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Valid FAQ id is required" });
    }

    if (typeof req.body.is_published !== "boolean") {
      return res.status(400).json({ error: "is_published boolean is required" });
    }

    const [result] = await pool.query(
      "UPDATE faq SET is_published = ? WHERE id = ?",
      [req.body.is_published, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    return res.json({
      message: req.body.is_published ? "FAQ published" : "FAQ hidden",
      is_published: req.body.is_published,
    });
  } catch (err) {
    console.error("Update FAQ visibility error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Valid FAQ id is required" });
    }

    const [existingRows] = await pool.query(
      "SELECT id, audience, type FROM faq WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    const existing = existingRows[0];

    await pool.query("DELETE FROM faq WHERE id = ?", [id]);
    await resequenceFaqs(existing.audience, existing.type);

    return res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error("Delete FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getFaqCategories = async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, audience, name, description, sort_order
      FROM categories
      ORDER BY audience, sort_order, name
    `);

    const grouped = {
      current: [],
      future: [],
    };

    for (const row of rows) {
      if (!grouped[row.audience]) grouped[row.audience] = [];

      grouped[row.audience].push({
        id: row.id,
        audience: row.audience,
        name: row.name,
        description: row.description || "",
        sort_order: row.sort_order,
      });
    }

    return res.json(grouped);
  } catch (err) {
    console.error("Get FAQ categories error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addCategory = async (req, res) => {
  try {
    const audience =
      typeof req.body.audience === "string" ? req.body.audience.trim() : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "";

    if (!["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const id = createCategoryId(name);

    if (!id) {
      return res.status(400).json({
        error: "Category name must include at least one letter or number",
      });
    }

    if (await categoryNameExists(audience, name)) {
      return res.status(409).json({
        error: "A category with that name already exists for this audience",
      });
    }

    const [maxRows] = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM categories WHERE audience = ?",
      [audience]
    );

    const nextSort = (maxRows?.[0]?.maxSort ?? 0) + 1;

    await pool.query(
      `
      INSERT INTO categories (id, audience, name, description, sort_order)
      VALUES (?, ?, ?, ?, ?)
      `,
      [id, audience, name, description, nextSort]
    );

    return res.status(201).json({
      message: "Category added successfully",
      category: {
        id,
        audience,
        name,
        description,
        sort_order: nextSort,
      },
    });
  } catch (err) {
    console.error("Add category error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const audience =
      typeof req.params.audience === "string"
        ? req.params.audience.trim()
        : "";
    const id = typeof req.params.id === "string" ? req.params.id.trim() : "";

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const description =
      typeof req.body.description === "string"
        ? req.body.description.trim()
        : "";

    if (!["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    if (!id) {
      return res.status(400).json({ error: "Category id is required" });
    }

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const nextId = createCategoryId(name);

    if (!nextId) {
      return res.status(400).json({
        error: "Category name must include at least one letter or number",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM categories WHERE id = ? AND audience = ?",
      [id, audience]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    if (await categoryNameExists(audience, name, id)) {
      return res.status(409).json({
        error: "A category with that name already exists for this audience",
      });
    }

    await pool.query(
      `
      UPDATE categories
      SET name = ?, description = ?
      WHERE id = ? AND audience = ?
      `,
      [name, description, id, audience]
    );

    return res.json({
      message: "Category updated successfully",
      category: {
        id,
        audience,
        name,
        description,
      },
    });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const audience =
      typeof req.params.audience === "string"
        ? req.params.audience.trim()
        : "";
    const id = typeof req.params.id === "string" ? req.params.id.trim() : "";

    if (!["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    if (!id) {
      return res.status(400).json({ error: "Category id is required" });
    }

    const [existing] = await pool.query(
      "SELECT id FROM categories WHERE id = ? AND audience = ?",
      [id, audience]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const [faqRows] = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM faq
      WHERE audience = ? AND type = ?
      `,
      [audience, id]
    );

    if (faqRows[0].count > 0) {
      return res.status(409).json({
        error:
          "This category still has FAQs. Move or delete those FAQs before deleting the category.",
      });
    }

    await pool.query("DELETE FROM categories WHERE id = ? AND audience = ?", [
      id,
      audience,
    ]);

    await resequenceCategories(audience);

    return res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

async function resequenceCategories(audience) {
  const [rows] = await pool.query(
    `
    SELECT id
    FROM categories
    WHERE audience = ?
    ORDER BY sort_order, name
    `,
    [audience]
  );

  for (let i = 0; i < rows.length; i += 1) {
    await pool.query(
      "UPDATE categories SET sort_order = ? WHERE audience = ? AND id = ?",
      [i + 1, audience, rows[i].id]
    );
  }
}

export const updateCategoryOrder = async (req, res) => {
  try {
    const audience =
      typeof req.body.audience === "string" ? req.body.audience.trim() : "";

    if (!["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    if (!Array.isArray(req.body.orderedIds)) {
      return res.status(400).json({ error: "orderedIds[] are required" });
    }

    const orderedIds = [
      ...new Set(
        req.body.orderedIds
          .map((id) => String(id).trim())
          .filter(Boolean)
      ),
    ];

    if (orderedIds.length === 0) {
      return res.json({ ok: true });
    }

    const [existingRows] = await pool.query(
      `
      SELECT id
      FROM categories
      WHERE audience = ?
      `,
      [audience]
    );

    const existingIds = existingRows.map((row) => row.id);
    const validOrderedIds = orderedIds.filter((id) => existingIds.includes(id));
    const missingIds = existingIds.filter((id) => !validOrderedIds.includes(id));
    const finalOrderedIds = [...validOrderedIds, ...missingIds];

    for (let i = 0; i < finalOrderedIds.length; i += 1) {
      await pool.query(
        "UPDATE categories SET sort_order = ? WHERE audience = ? AND id = ?",
        [i + 1, audience, finalOrderedIds[i]]
      );
    }

    return res.json({ message: "Category order updated successfully" });
  } catch (err) {
    console.error("Update category order error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateFaqOrder = async (req, res) => {
  try {
    const audience =
      typeof req.body.audience === "string" ? req.body.audience.trim() : "";
    const type = typeof req.body.type === "string" ? req.body.type.trim() : "";

    if (!["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    const allowedCategoryIds = await getValidCategoryIds(audience);

    if (!allowedCategoryIds.includes(type)) {
      return res
        .status(400)
        .json({ error: "Invalid category for the selected audience" });
    }

    if (!Array.isArray(req.body.orderedIds)) {
      return res.status(400).json({ error: "orderedIds[] are required" });
    }

    const orderedIds = [
      ...new Set(
        req.body.orderedIds
          .map((id) => Number(id))
          .filter((id) => Number.isInteger(id) && id > 0)
      ),
    ];

    if (orderedIds.length === 0) {
      return res.json({ ok: true });
    }

    const [existingRows] = await pool.query(
      `SELECT id
       FROM faq
       WHERE audience = ? AND type = ?
       ORDER BY sort_order, created_at, id`,
      [audience, type]
    );

    const existingIds = existingRows.map((row) => row.id);
    const validOrderedIds = orderedIds.filter((id) => existingIds.includes(id));
    const missingIds = existingIds.filter((id) => !validOrderedIds.includes(id));
    const finalOrderedIds = [...validOrderedIds, ...missingIds];

    const caseSql = finalOrderedIds
      .map((id, idx) => `WHEN ${id} THEN ${idx + 1}`)
      .join(" ");

    const sql = `
      UPDATE faq
      SET sort_order = CASE id ${caseSql} ELSE sort_order END
      WHERE audience = ? AND type = ? AND id IN (${finalOrderedIds
        .map(() => "?")
        .join(",")})
    `;

    await pool.query(sql, [audience, type, ...finalOrderedIds]);

    return res.json({ ok: true });
  } catch (err) {
    console.error("Update order error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default {
  addFaq,
  getFaqs,
  getFaqCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrder,
  updateFaq,
  updateFaqVisibility,
  deleteFaq,
  updateFaqOrder,
};
