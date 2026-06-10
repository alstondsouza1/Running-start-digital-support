import pool from "../db/db.js";
import initialSchema from "./001_initial_schema.js";
import { runMigrationList } from "./runner.js";

const migrations = [initialSchema];

export async function runMigrations() {
  await runMigrationList(pool, migrations);
}
