import pool from "../db/db.js";

export const getFaqs = async (req, res) => {
  try {
    const { audience } = req.query;

    if (!audience) {
      return res.status(400).json({ error: "audience query parameter is required" });
    }

    const [rows] = await pool.query(
      `SELECT id, audience, type, question, answer, sort_order, created_at
       FROM faq
       WHERE audience = ?
       ORDER BY type, sort_order, created_at`,
      [audience]
    );

    // If mysql2 returns JSON as string sometimes, normalize it
    const formatted = rows.map((row) => {
      const answer = typeof row.answer === "string" ? JSON.parse(row.answer) : row.answer;

      return {
        id: row.id,
        audience: row.audience,
        type: row.type,
        sort_order: row.sort_order,
        created_at: row.created_at,
        question: row.question,
        answer, // { intro?, bullets: [...] }
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Get FAQ error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const addFaq = async (req, res) => {
  try {
    const { audience, type, question, answer } = req.body;

    if (!audience || !type || !question || !answer) {
      return res.status(400).json({
        error: "audience, type, question, and answer are required",
      });
    }

    // Your UI + StudentFAQPage expects: answer = { intro?, bullets: [{text, url?}, ...] }
    if (!Array.isArray(answer.bullets)) {
      return res.status(400).json({ error: "answer.bullets must be an array" });
    }

    for (const b of answer.bullets) {
      if (!b || typeof b.text !== "string") {
        return res.status(400).json({
          error: "Each bullet must be an object like { text: string, url?: string }",
        });
      }
      if (b.url && typeof b.url !== "string") {
        return res.status(400).json({
          error: "If provided, bullet.url must be a string",
        });
      }
    }

    // put new item at the end of its category
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

// Persist DnD ordering from admin dashboard
export const updateFaqOrder = async (req, res) => {
  try {
    const { audience, type, orderedIds } = req.body;

    if (!audience || !type || !Array.isArray(orderedIds)) {
      return res.status(400).json({
        error: "audience, type, orderedIds[] are required",
      });
    }

    if (orderedIds.length === 0) {
      return res.json({ ok: true });
    }

    const caseSql = orderedIds
      .map((id, idx) => `WHEN ${Number(id)} THEN ${idx + 1}`)
      .join(" ");

    const sql = `
      UPDATE faq
      SET sort_order = CASE id ${caseSql} ELSE sort_order END
      WHERE audience = ? AND type = ? AND id IN (${orderedIds.map(() => "?").join(",")})
    `;

    await pool.query(sql, [audience, type, ...orderedIds]);

    res.json({ ok: true });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export default { addFaq, getFaqs, updateFaqOrder };