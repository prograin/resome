import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { courseDefinitions } from "../src/lib/db/schema/index.js";
import { getStudentRuntime } from "../src/lib/student-auth/server.js";
import { databaseSchemaVersion } from "../src/lib/db/client.js";

const database = await createTestDatabase("student_runtime");
const key = Symbol.for("prograin.student-auth.runtime");
const oldRuntime = globalThis[key];
const keys = ["NODE_ENV", "DATABASE_URL", "BETTER_AUTH_URL", "BETTER_AUTH_SECRET"];
const environment = Object.fromEntries(keys.map((name) => [name, process.env[name]]));
let runtime;
try {
  await migrateStudentDatabase(database.db);
  Object.assign(process.env, {
    NODE_ENV: "development",
    DATABASE_URL: database.url,
    BETTER_AUTH_URL: "http://127.0.0.1:4173",
    BETTER_AUTH_SECRET: randomBytes(32).toString("hex"),
  });
  delete globalThis[key];
  const initial = getStudentRuntime();
  runtime = initial;
  const legacyDefinition = pgTable("student_course_definition", {
    id: integer().primaryKey(),
    title: text(),
  });
  initial.db.select().from(legacyDefinition).toSQL();
  assert.throws(
    () => initial.db.select().from(courseDefinitions).toSQL(),
    TypeError,
    "reproduce the stale Drizzle column-name cache after adding course fields",
  );
  initial.schemaVersion = "before-shared-course-resources";
  const listeners = initial.pool.listenerCount("error");
  runtime = getStudentRuntime();
  assert.notEqual(runtime, initial);
  assert.notEqual(runtime.db, initial.db);
  assert.notEqual(runtime.auth, initial.auth);
  assert.equal(runtime.pool, initial.pool, "reuse the existing connection pool");
  assert.equal(runtime.pool.listenerCount("error"), listeners, "do not duplicate pool listeners");
  assert.equal(runtime.schemaVersion, databaseSchemaVersion);
  assert.equal(getStudentRuntime(), runtime, "stable schema must reuse the refreshed runtime");
  const [created] = await runtime.db
    .insert(courseDefinitions)
    .values({
      title: "Updated schema",
      difficulty: "intermediate",
      sharedContent: true,
      syllabus: ["Basics"],
    })
    .returning();
  assert.equal(created.difficulty, "intermediate");
  assert.deepEqual((await runtime.db.select().from(courseDefinitions))[0].syllabus, ["Basics"]);
  console.log(
    "PASS schema reload: reproduced stale cache, rebuilt ORM/auth/limits, reused pool and queried new course fields.",
  );
} finally {
  if (oldRuntime) globalThis[key] = oldRuntime;
  else delete globalThis[key];
  for (const [name, value] of Object.entries(environment)) {
    if (value === undefined) delete process.env[name];
    else process.env[name] = value;
  }
  try {
    await runtime?.pool.end();
  } finally {
    await database.close();
  }
}
