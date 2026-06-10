import pool from "../db/db.js";
import { runMigrations } from "../migrations/index.js";

try {
  await runMigrations();
  console.log("Database migrations are up to date.");
  await pool.end();
} catch (error) {
  console.error("Database migration failed:", error.message);
  await pool.end();
  process.exit(1);
}
