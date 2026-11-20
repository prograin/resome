import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { sql } from "drizzle-orm";
import { createDatabase } from "../../src/lib/db/client.js";

export async function createTestDatabase(prefix) {
  const scratch = process.env.STUDENT_TEST_DATABASE_URL;
  assert.ok(
    scratch && scratch !== process.env.DATABASE_URL,
    "Specify a separate scratch PostgreSQL server with database-creation rights.",
  );
  const admin = createDatabase(scratch);
  const name = `${prefix}_test_${randomBytes(8).toString("hex")}`;
  try {
    await admin.db.execute(sql`create database ${sql.identifier(name)}`);
  } catch (error) {
    await admin.pool.end();
    throw error;
  }
  const url = new URL(scratch);
  url.pathname = `/${name}`;
  const database = createDatabase(url.href);
  return {
    ...database,
    url: url.href,
    async close() {
      await database.pool.end();
      try {
        await admin.db.execute(sql`drop database ${sql.identifier(name)}`);
      } finally {
        await admin.pool.end();
      }
    },
  };
}
