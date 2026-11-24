import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { seedActivityData } from "./students/activity-data.mjs";
import { users, awards } from "../src/lib/db/schema/index.js";
import { studentPaths } from "../src/lib/student-auth/paths.js";
import { accountCopy } from "../src/features/students/account-copy.js";
import { studentRankings } from "../src/lib/db/rankings.js";

const database = await createTestDatabase("inactivity_ui");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  process.env.CRON_SECRET = randomBytes(32).toString("hex");
  fixture = await createStudentFixture();
  const { db } = database;
  const { context, page, origin, studentId, otherId, admin, username, password } = fixture;
  await seedActivityData(db, fixture);
  await db
    .update(awards)
    .set({ recordedAt: new Date(Date.now() - 61 * 86400000).toISOString() })
    .where(eq(awards.studentId, studentId));
  const login = () =>
    context.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username, password },
    });
  assert.equal((await login()).status(), 200);
  const endpoint = origin + "/api/cron/student-inactivity/";
  assert.equal((await context.request.get(endpoint)).status(), 401);
  assert.equal(
    (await context.request.get(endpoint, { headers: { authorization: "Bearer wrong" } })).status(),
    401,
  );
  const run = await context.request.get(endpoint, {
    headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
  });
  assert.equal(run.status(), 200);
  assert.equal(run.headers()["cache-control"], "no-store");
  assert.deepEqual(await run.json(), { deactivated: 1 });
  assert.deepEqual(
    await (
      await context.request.get(endpoint, {
        headers: { authorization: `Bearer ${process.env.CRON_SECRET}` },
      })
    ).json(),
    { deactivated: 0 },
  );
  const [student] = await db.select().from(users).where(eq(users.id, studentId));
  assert.equal(student.academyActive, false);
  assert.equal(student.academyBanned, false);
  assert.equal(student.academyInactiveReason, "no-score-60-days");
  assert.ok(student.academyInactiveAt);
  const session = await (await context.request.get(origin + "/api/auth/get-session/")).json();
  assert.equal(session.user.academyInactiveReason, "no-score-60-days");
  assert.equal(session.user.academyActive, false);
  await page.goto(fixture.dashboard);
  await page.getByText(accountCopy.fa.autoInactive, { exact: true }).waitFor();
  assert.equal(await page.locator(".student-chart__metrics").count(), 0);
  await page.goto(origin + studentPaths.history);
  await page.getByText(accountCopy.fa.autoInactive, { exact: true }).waitFor();
  assert.equal((await db.select().from(awards).where(eq(awards.studentId, studentId))).length, 2);
  const ranked = await studentRankings(db, admin);
  assert.equal(
    ranked.some((row) => row.studentId === studentId),
    false,
  );
  assert.equal(ranked.find((row) => row.studentId === otherId).overallRank, 1);
  assert.equal((await login()).status(), 200, "inactive accounts can still sign in");
  console.log(
    "PASS protected inactivity cron endpoint, idempotent execution, session reason, clear automatic notice, preserved access/history and ranking removal.",
  );
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
