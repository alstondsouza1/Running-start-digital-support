import DEFAULT_CATEGORIES from "../config/defaultCategories.js";

async function columnExists(connection, tableName, columnName) {
  const [rows] = await connection.query(
    `
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [tableName, columnName]
  );

  return rows.length > 0;
}

async function getColumnType(connection, tableName, columnName) {
  const [rows] = await connection.query(
    `
      SELECT DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
      LIMIT 1
    `,
    [tableName, columnName]
  );

  return rows[0]?.DATA_TYPE || "";
}

async function resequenceCategories(connection, audience) {
  const [rows] = await connection.query(
    `
      SELECT id
      FROM categories
      WHERE audience = ?
      ORDER BY sort_order, name
    `,
    [audience]
  );

  for (let index = 0; index < rows.length; index += 1) {
    await connection.query(
      "UPDATE categories SET sort_order = ? WHERE audience = ? AND id = ?",
      [index + 1, audience, rows[index].id]
    );
  }
}

export default {
  id: "001_initial_schema",

  async up(connection) {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS faq (
        id INT AUTO_INCREMENT PRIMARY KEY,
        audience VARCHAR(10) NOT NULL,
        type VARCHAR(100) NOT NULL,
        question TEXT NOT NULL,
        answer JSON NOT NULL,
        is_published BOOLEAN NOT NULL DEFAULT TRUE,
        sort_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_audience (audience),
        INDEX idx_type (type),
        INDEX idx_audience_type_sort (audience, type, sort_order)
      )
    `);

    if (!(await columnExists(connection, "faq", "is_published"))) {
      await connection.query(`
        ALTER TABLE faq
        ADD COLUMN is_published BOOLEAN NOT NULL DEFAULT TRUE
        AFTER answer
      `);
    }

    if (!(await columnExists(connection, "faq", "sort_order"))) {
      await connection.query(`
        ALTER TABLE faq
        ADD COLUMN sort_order INT NOT NULL DEFAULT 0
        AFTER is_published
      `);
    }

    if (!(await columnExists(connection, "faq", "updated_at"))) {
      await connection.query(`
        ALTER TABLE faq
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP
        AFTER created_at
      `);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(100) NOT NULL,
        audience VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sort_order INT NOT NULL DEFAULT 0,
        PRIMARY KEY (id, audience)
      )
    `);

    if (!(await columnExists(connection, "categories", "description"))) {
      await connection.query(
        "ALTER TABLE categories ADD COLUMN description TEXT"
      );
    }

    if (!(await columnExists(connection, "categories", "sort_order"))) {
      await connection.query(
        "ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0"
      );
    }

    const categoryIdType = await getColumnType(connection, "categories", "id");

    if (categoryIdType && categoryIdType !== "varchar") {
      await connection.query(`
        ALTER TABLE categories
          DROP PRIMARY KEY,
          MODIFY COLUMN id VARCHAR(100) NOT NULL,
          ADD PRIMARY KEY (id, audience)
      `);
    }

    await connection.query("DELETE FROM categories WHERE id REGEXP '^[0-9]+$'");

    for (const [audience, categories] of Object.entries(DEFAULT_CATEGORIES)) {
      for (let index = 0; index < categories.length; index += 1) {
        const category = categories[index];

        await connection.query(
          `
            INSERT IGNORE INTO categories
              (id, audience, name, description, sort_order)
            VALUES (?, ?, ?, ?, ?)
          `,
          [
            category.id,
            audience,
            category.name,
            category.description || "",
            index + 1,
          ]
        );
      }

      await resequenceCategories(connection, audience);
    }
  },
};
