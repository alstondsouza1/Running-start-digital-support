import pool from "../db/db.js";

const ALLOWED_CATEGORIES = {
  current: [
    "fee-waiver-book-loan",
    "how-to-plan-classes",
    "dates-deadlines",
    "campus-resources",
  ],
  future: ["general", "enrollment", "classes", "other"],
};

function normalizeAnswer(answer) {
  if (!answer || typeof answer !== "object") {
    return { error: "answer is required and must be an object" };
  }

  const intro =
    typeof answer.intro === "string" ? answer.intro.trim() : "";

  if (!Array.isArray(answer.bullets)) {
    return { error: "answer.bullets must be an array" };
  }

  const bullets = answer.bullets
    .map((bullet) => ({
      text: typeof bullet?.text === "string" ? bullet.text.trim() : "",
      ...(typeof bullet?.url === "string" && bullet.url.trim()
        ? { url: bullet.url.trim() }
        : {}),
    }))
    .filter((bullet) => bullet.text.length > 0);

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

function validateFaqInput({ audience, type, question, answer }) {
  const trimmedAudience = typeof audience === "string" ? audience.trim() : "";
  const trimmedType = typeof type === "string" ? type.trim() : "";
  const trimmedQuestion = typeof question === "string" ? question.trim() : "";

  if (!trimmedAudience || !trimmedType || !trimmedQuestion || !answer) {
    return {
      error: "audience, type, question, and answer are required",
    };
  }

  if (!Object.hasOwn(ALLOWED_CATEGORIES, trimmedAudience)) {
    return { error: "Invalid audience value" };
  }

  if (!ALLOWED_CATEGORIES[trimmedAudience].includes(trimmedType)) {
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
    const audience = typeof req.query.audience === "string" ? req.query.audience.trim() : "";

    if (!audience) {
      return res.status(400).json({ error: "audience query parameter is required" });
    }

    if (!Object.hasOwn(ALLOWED_CATEGORIES, audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    const [rows] = await pool.query(
      `SELECT id, audience, type, question, answer, sort_order, created_at
       FROM faq
       WHERE audience = ?
       ORDER BY type, sort_order, created_at`,
      [audience]
    );

    const formatted = rows.map((row) => {
      const answer = typeof row.answer === "string" ? JSON.parse(row.answer) : row.answer;

      return {
        id: row.id,
        audience: row.audience,
        type: row.type,
        sort_order: row.sort_order,
        created_at: row.created_at,
        question: row.question,
        answer,
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error("Get FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const addFaq = async (req, res) => {
  try {
    const validated = validateFaqInput(req.body);
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

    const validated = validateFaqInput(req.body);
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

    if (existing.audience !== audience || existing.type !== type) {
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
      "SELECT id FROM faq WHERE id = ?",
      [id]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    await pool.query("DELETE FROM faq WHERE id = ?", [id]);

    return res.json({ message: "FAQ deleted successfully" });
  } catch (err) {
    console.error("Delete FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getFaqCategories = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT audience, type
       FROM faq
       ORDER BY audience, type`
    );

    const categories = rows.reduce((acc, { audience, type }) => {
      if (!acc[audience]) acc[audience] = [];
      acc[audience].push(type);
      return acc;
    }, {});

    return res.json(categories);
  } catch (err) {
    console.error("Get FAQ categories error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateFaqOrder = async (req, res) => {
  try {
    const audience = typeof req.body.audience === "string" ? req.body.audience.trim() : "";
    const type = typeof req.body.type === "string" ? req.body.type.trim() : "";

    if (!Object.hasOwn(ALLOWED_CATEGORIES, audience)) {
      return res.status(400).json({ error: "Invalid audience value" });
    }

    if (!ALLOWED_CATEGORIES[audience].includes(type)) {
      return res.status(400).json({ error: "Invalid category for the selected audience" });
    }

    if (!Array.isArray(req.body.orderedIds)) {
      return res.status(400).json({ error: "orderedIds[] are required" });
    }

    const orderedIds = [...new Set(
      req.body.orderedIds
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )];

    if (orderedIds.length === 0) {
      return res.json({ ok: true });
    }

    const caseSql = orderedIds
      .map((id, idx) => `WHEN ${id} THEN ${idx + 1}`)
      .join(" ");

    const sql = `
      UPDATE faq
      SET sort_order = CASE id ${caseSql} ELSE sort_order END
      WHERE audience = ? AND type = ? AND id IN (${orderedIds.map(() => "?").join(",")})
    `;

    await pool.query(sql, [audience, type, ...orderedIds]);

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
  updateFaq,
  deleteFaq,
  updateFaqOrder,
};