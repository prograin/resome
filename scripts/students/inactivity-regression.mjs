import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "../lib/test-database.mjs";
import { migrateStudentDatabase } from "../../src/lib/db/migrate.js";
import { users, awards } from "../../src/lib/db/schema/index.js";
import { deactivateIdleStudents, inactivityPolicy } from "../../src/lib/student-inactivity.js";

export async function checkInactivityBatchRace() {
  const { db, close } = await createTestDatabase("inactivity_batch");
  try {
    await migrateStudentDatabase(db);
    const createdAt = new Date(Date.now() - 90 * 86400000);
    await db.insert(users).values([
      ...Array.from({ length: inactivityPolicy.batchSize }, (_, i) => ({
        id: `batch_old_${String(i).padStart(3, "0")}`,
        name: "Old student",
        username: `batch_old_${i}`,
        email: `batch_old_${i}@example.test`,
        createdAt,
      })),
      {
        id: "zz_recent",
        name: "Recently graded",
        username: "recent",
        email: "recent@example.test",
        createdAt,
      },
    ]);
    let batches = 0;
    const observed = {
      transaction: async (...args) => {
        const result = await db.transaction(...args);
        if (++batches === 1) {
          await delay(10);
          await db.insert(awards).values({ studentId: "zz_recent", points: 5, kind: "other" });
        }
        return result;
      },
    };
    const result = await deactivateIdleStudents(observed, "teacher");
    assert.equal(result.deactivated, inactivityPolicy.batchSize);
    const [student] = await db.select().from(users).where(eq(users.id, "zz_recent"));
    assert.equal(
      student.academyActive,
      true,
      "a score committed between batches must prevent deactivation",
    );
    assert.equal(student.academyInactiveReason, null);
    assert.equal((await deactivateIdleStudents(db, "teacher")).deactivated, 0);
    console.log(
      "PASS inactivity regression: a real-time score committed between batches keeps the student active.",
    );
  } finally {
    await close();
  }
}
