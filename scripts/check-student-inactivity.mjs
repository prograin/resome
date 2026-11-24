import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { users, awards } from "../src/lib/db/schema/index.js";
import { deactivateIdleStudents, inactivityPolicy } from "../src/lib/student-inactivity.js";
import { addStudentAward } from "../src/lib/db/student-records.js";
import { authorizedCron } from "../src/lib/security/cron-request.js";
import { checkInactivityBatchRace } from "./students/inactivity-regression.mjs";

const { db, close } = await createTestDatabase("inactivity");
const now = new Date("2026-11-24T10:00:00Z");
const day = 86400000;
const ago = (days) => new Date(now.getTime() - days * day);
try {
  await migrateStudentDatabase(db);
  await migrateStudentDatabase(db);
  await assert.rejects(deactivateIdleStudents(db, null, now), /STUDENT_ADMIN_USERNAME/);
  const ids = [
    "old",
    "boundary",
    "recent",
    "never",
    "fresh",
    "future",
    "general",
    "teacher",
    "inactive",
    "banned",
  ];
  await db.insert(users).values(
    ids.map((id) => ({
      id,
      name: id,
      username: id,
      email: `${id}@example.test`,
      createdAt: ago(id === "fresh" ? 1 : 100),
      academyActive: !["inactive", "banned"].includes(id),
      academyBanned: id === "banned",
    })),
  );
  await db.insert(awards).values(
    [
      { studentId: "old", points: 4, recordedAt: ago(90).toISOString() },
      { studentId: "boundary", points: 3, recordedAt: ago(60).toISOString() },
      { studentId: "recent", points: 5, recordedAt: new Date(ago(60).getTime() + 1).toISOString() },
      { studentId: "general", points: 4, recordedAt: ago(1).toISOString() },
      { studentId: "future", points: 5, recordedAt: ago(-1).toISOString() },
    ].map((row) => ({ ...row, kind: "other" })),
  );
  const runs = await Promise.all([
    deactivateIdleStudents(db, "teacher", now),
    deactivateIdleStudents(db, "teacher", now),
  ]);
  assert.equal(
    runs.reduce((sum, run) => sum + run.deactivated, 0),
    4,
  );
  assert.deepEqual(await deactivateIdleStudents(db, "teacher", now), { deactivated: 0 });
  const students = new Map((await db.select().from(users)).map((row) => [row.id, row]));
  for (const id of ["old", "boundary", "never", "future"]) {
    assert.equal(students.get(id).academyActive, false);
    assert.equal(students.get(id).academyBanned, false);
    assert.equal(students.get(id).academyInactiveReason, inactivityPolicy.reason);
    assert.equal(students.get(id).academyInactiveAt.toISOString(), now.toISOString());
  }
  for (const id of ["recent", "fresh", "general", "teacher"])
    assert.equal(students.get(id).academyActive, true);
  assert.equal(students.get("banned").academyBanned, true);
  assert.equal(students.get("inactive").academyInactiveReason, null);
  assert.equal((await db.select().from(awards)).length, 5, "history preserved");
  assert.equal(
    await db.transaction((tx) =>
      addStudentAward(tx, { studentId: "old", points: 5, kind: "other" }),
    ),
    null,
  );
  await db.insert(users).values({
    id: "race",
    username: "race",
    name: "Race",
    email: "race@example.test",
    createdAt: ago(90),
  });
  let release, locked;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const acquired = new Promise((resolve) => {
    locked = resolve;
  });
  const writer = db.transaction(async (tx) => {
    await tx.select({ id: users.id }).from(users).where(eq(users.id, "race")).for("update");
    locked();
    await gate;
    return addStudentAward(tx, {
      studentId: "race",
      points: 5,
      kind: "other",
      recordedAt: now.toISOString(),
    });
  });
  await acquired;
  try {
    assert.equal((await deactivateIdleStudents(db, "teacher", now)).deactivated, 0);
  } finally {
    release();
  }
  assert.ok(await writer);
  assert.equal((await deactivateIdleStudents(db, "teacher", now)).deactivated, 0);
  assert.equal((await db.select().from(users).where(eq(users.id, "race")))[0].academyActive, true);
  const previousSecret = process.env.CRON_SECRET;
  try {
    process.env.CRON_SECRET = "a".repeat(48);
    assert.equal(
      authorizedCron(new Request("https://example.test/api/cron/student-inactivity/")),
      false,
    );
    assert.equal(
      authorizedCron(
        new Request("https://example.test/api/cron/student-inactivity/", {
          headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
        }),
      ),
      true,
    );
  } finally {
    if (previousSecret === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = previousSecret;
  }
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  assert.equal(
    config.crons.find((job) => job.path === "/api/cron/student-inactivity/").schedule,
    "0 6 * * *",
  );
  console.log(
    "PASS daily inactivity: 60-day millisecond boundary, no-score grace, future exclusion, general scores, admin/banned exclusion, audit reason/date, idempotency, concurrent cron/score writers and cron authorization.",
  );
} finally {
  await close();
}

await checkInactivityBatchRace();
