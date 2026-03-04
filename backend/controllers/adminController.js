import pool from "../db/db.js";

export const getFaqs = async (req, res) => {
  try {
    const { audience } = req.query;

    if (!audience) {
      return res.status(400).json({ error: "audience query parameter is required" });
    }

    const [rows] = await pool.query(
      "SELECT * FROM faq WHERE audience = ? ORDER BY type, created_at",
      [audience]
    );

    const formatted = rows.map((row) => {
      const data = typeof row.data === "string" ? JSON.parse(row.data) : row.data;
      return {
        id: row.id,
        audience: row.audience,
        type: row.type,
        ...data,
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

    if (!Array.isArray(answer.bullets)) {
      return res.status(400).json({ error: "answer.bullets must be an array" });
    }

    const content = { question, answer };

    const sql = `
      INSERT INTO faq (audience, type, data)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      audience,
      type,
      JSON.stringify(content),
    ]);

    return res.status(201).json({
      message: "FAQ added successfully",
      id: result.insertId,
    });
  } catch (err) {
    console.error("Add FAQ error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

export default { addFaq, getFaqs };