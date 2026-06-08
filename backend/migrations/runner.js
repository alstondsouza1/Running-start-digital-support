export async function runMigrationList(database, migrationList) {
  const connection = await database.getConnection();

  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await connection.query("SELECT id FROM schema_migrations");
    const applied = new Set(rows.map((row) => row.id));

    for (const migration of migrationList) {
      if (applied.has(migration.id)) continue;

      console.log(`Applying database migration: ${migration.id}`);
      await migration.up(connection);
      await connection.query(
        "INSERT INTO schema_migrations (id) VALUES (?)",
        [migration.id]
      );
    }
  } finally {
    connection.release();
  }
}
