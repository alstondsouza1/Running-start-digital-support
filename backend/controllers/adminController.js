import pool from "../db/db.js";

const ALLOWED_CATEGORIES = {
  current: [
    {
      id: "fee-waiver-book-loan",
      name: "Fee Waiver & Book Loan",
      description: "Fee waiver steps, book loan info, and related support",
    },
    {
      id: "how-to-plan-classes",
      name: "How to Plan Classes",
      description: "Advising, planning schedules, and choosing classes",
    },
    {
      id: "dates-deadlines",
      name: "Dates & Deadlines",
      description: "Enrollment deadlines, important dates, and term timelines",
    },
    {
      id: "campus-resources",
      name: "Campus Resources",
      description: "Support services, offices, and student resources at GRC",
    },
  ],
  future: [
    {
      id: "general",
      name: "General Questions",
      description: "Program overview, eligibility, and participation basics",
    },
    {
      id: "enrollment",
      name: "Enrollment",
      description: "Deadlines, placement, and getting registered",
    },
    {
      id: "classes",
      name: "Classes",
      description: "Allowed courses, online learning, transfer, and degrees",
    },
    {
      id: "other",
      name: "Other",
      description: "Moving districts, FERPA, and parent/guardian info",
    },
  ],
};

function getAllowedCategoryIds(audience) {
  return ALLOWED_CATEGORIES[audience]?.map((category) => category.id) ?? [];
}

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

async function getValidCategoryIds(audience) {
  try {
    const [rows] = await pool.query(
      "SELECT id FROM categories WHERE audience = ?",
      [audience]
    );
    if (rows.length > 0) return rows.map((r) => r.id);
  } catch {
    // fall through to hardcoded
  }
  return getAllowedCategoryIds(audience);
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

  const validAudiences = ["current", "future"];
  if (!validAudiences.includes(trimmedAudience)) {
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

    if (!Object.hasOwn(ALLOWED_CATEGORIES, audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    const [rows] = await pool.query(
      `SELECT id, audience, type, question, answer, sort_order, created_at
       FROM faq
       WHERE audience = ?
       ORDER BY type, sort_order, created_at, id`,
      [audience]
    );

    const formatted = rows.map((row) => ({
      id: row.id,
      audience: row.audience,
      type: row.type,
      sort_order: row.sort_order,
      created_at: row.created_at,
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

    const [maxRows] = await pool.query(
      "SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM faq WHERE audience = ? AND type = ?",
      [audience, type]
    );

    const nextSort = (maxRows?.[0]?.maxSort ?? 0) + 1;

    const [result] = await pool.query(
      "INSERT INTO faq (audience, type, question, answer, sort_order) VALUES (?, ?, ?, ?, ?)",
      [audience, type, question, JSON.stringify(answer), nextSort]
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
      "SELECT id, audience, type, sort_order FROM faq WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    const existing = existingRows[0];
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
       SET audience = ?, type = ?, question = ?, answer = ?, sort_order = ?
       WHERE id = ?`,
      [audience, type, question, JSON.stringify(answer), sortOrder, id]
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

async function ensureCategoriesTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(100) NOT NULL,
      audience VARCHAR(20) NOT NULL,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      PRIMARY KEY (id, audience)
    )
  `);

  // fix description column if missing
  const [cols] = await pool.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'description'`
  );
  if (cols.length === 0) {
    await pool.query("ALTER TABLE categories ADD COLUMN description TEXT");
  }

  // fix id column if it was created as INT instead of VARCHAR
  const [idCol] = await pool.query(
    `SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'categories' AND COLUMN_NAME = 'id'`
  );
  if (idCol.length > 0 && idCol[0].DATA_TYPE !== 'varchar') {
    // drop old PK and change column type in one statement to satisfy sql_require_primary_key
    await pool.query(`
      ALTER TABLE categories
        DROP PRIMARY KEY,
        MODIFY COLUMN id VARCHAR(100) NOT NULL,
        ADD PRIMARY KEY (id, audience)
    `);
  }

  const [existing] = await pool.query("SELECT COUNT(*) AS cnt FROM categories");
  if (existing[0].cnt === 0) {
    const seeds = [];
    for (const [audience, cats] of Object.entries(ALLOWED_CATEGORIES)) {
      for (const cat of cats) {
        seeds.push([cat.id, audience, cat.name, cat.description || ""]);
      }
    }
    for (const seed of seeds) {
      await pool.query(
        "INSERT IGNORE INTO categories (id, audience, name, description) VALUES (?, ?, ?, ?)",
        seed
      );
    }
  }
}

export const getFaqCategories = async (_req, res) => {
  try {
    await ensureCategoriesTable();

    const [rows] = await pool.query(
      "SELECT id, audience, name, description FROM categories ORDER BY audience, name"
    );

    const grouped = {};
    for (const row of rows) {
      if (!grouped[row.audience]) grouped[row.audience] = [];
      grouped[row.audience].push({
        id: row.id,
        name: row.name,
        description: row.description || "",
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
    await ensureCategoriesTable();
    const audience = typeof req.body.audience === "string" ? req.body.audience.trim() : "";
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";

    if (!audience || !name) {
      return res.status(400).json({ error: "audience and name are required" });
    }

    if (!Object.hasOwn(ALLOWED_CATEGORIES, audience) && !["current", "future"].includes(audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    const id = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const [existing] = await pool.query(
      "SELECT id FROM categories WHERE id = ? AND audience = ?",
      [id, audience]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "A category with that name already exists for this audience" });
    }

    await pool.query(
      "INSERT INTO categories (id, audience, name, description) VALUES (?, ?, ?, ?)",
      [id, audience, name, description]
    );

    return res.status(201).json({ message: "Category added successfully", id });
  } catch (err) {
    console.error("Add category error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    await ensureCategoriesTable();
    const categoryId = req.params.id;
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const description = typeof req.body.description === "string" ? req.body.description.trim() : "";

    if (!name) {
      return res.status(400).json({ error: "name is required" });
    }

    const [existing] = await pool.query("SELECT id FROM categories WHERE id = ?", [categoryId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    await pool.query(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?",
      [name, description, categoryId]
    );

    return res.json({ message: "Category updated successfully" });
  } catch (err) {
    console.error("Update category error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    await ensureCategoriesTable();
    const categoryId = req.params.id;

    const [existing] = await pool.query("SELECT id FROM categories WHERE id = ?", [categoryId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    await pool.query("DELETE FROM categories WHERE id = ?", [categoryId]);

    return res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete category error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateFaqOrder = async (req, res) => {
  try {
    const audience =
      typeof req.body.audience === "string" ? req.body.audience.trim() : "";
    const type = typeof req.body.type === "string" ? req.body.type.trim() : "";

    const validAudiences = ["current", "future"];
    if (!validAudiences.includes(audience)) {
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
    const missingIds = existingIds.filter((id) => !orderedIds.includes(id));
    const finalOrderedIds = [...orderedIds, ...missingIds];

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
  updateFaq,
  deleteFaq,
  updateFaqOrder,
};