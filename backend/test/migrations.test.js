import assert from "node:assert/strict";
import test from "node:test";
import { runMigrationList } from "../migrations/runner.js";

function createFakeDatabase(appliedIds = []) {
  const calls = [];
  const applied = [...appliedIds];
  let released = false;

  const connection = {
    async query(sql, params = []) {
      calls.push({ sql, params });

      if (sql === "SELECT id FROM schema_migrations") {
        return [applied.map((id) => ({ id }))];
      }

      if (sql.startsWith("INSERT INTO schema_migrations")) {
        applied.push(params[0]);
      }

      return [[]];
    },
    release() {
      released = true;
    },
  };

  return {
    database: {
      async getConnection() {
        return connection;
      },
    },
    calls,
    applied,
    wasReleased: () => released,
  };
}

test("runMigrations applies and records pending migrations", async () => {
  const fake = createFakeDatabase();
  let ran = false;

  await runMigrationList(fake.database, [
    {
      id: "test_migration",
      async up() {
        ran = true;
      },
    },
  ]);

  assert.equal(ran, true);
  assert.deepEqual(fake.applied, ["test_migration"]);
  assert.equal(fake.wasReleased(), true);
});

test("runMigrations skips migrations already recorded", async () => {
  const fake = createFakeDatabase(["test_migration"]);
  let ran = false;

  await runMigrationList(fake.database, [
    {
      id: "test_migration",
      async up() {
        ran = true;
      },
    },
  ]);

  assert.equal(ran, false);
  assert.deepEqual(fake.applied, ["test_migration"]);
  assert.equal(fake.wasReleased(), true);
});
