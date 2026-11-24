import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { eq } from "drizzle-orm";
import AxeBuilder from "@axe-core/playwright";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createStudentContext } from "./lib/student-browser-context.mjs";
import { selectAccountStatus } from "./students/account-status.mjs";
import { seedActivityData } from "./students/activity-data.mjs";
import { checkBannedAccess } from "./students/banned-access.mjs";
import { users, sessions, awards } from "../src/lib/db/schema/index.js";
import { studentPaths } from "../src/lib/student-auth/paths.js";
import { accountCopy } from "../src/features/students/account-copy.js";
import { accountBannedCode } from "../src/lib/student-account.js";
import { studentRankings } from "../src/lib/db/rankings.js";

const database = await createTestDatabase("student_bans");
let fixture, student, other, guest;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { db } = database;
  const { page, origin, browser, context, admin, username, password, studentId, otherId } = fixture;
  await seedActivityData(db, fixture);
  const login = (target, account, secret = password) =>
    target.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: account, password: secret },
    });
  student = await createStudentContext(browser, { viewport: { width: 390, height: 900 } });
  other = await browser.newContext();
  guest = await createStudentContext(browser, { viewport: { width: 390, height: 900 } });
  assert.equal((await login(student, username)).status(), 200);
  assert.equal((await login(context, admin)).status(), 200);
  assert.equal((await login(other, fixture.other)).status(), 200);
  const studentPage = await student.newPage();
  await studentPage.clock.install();
  await studentPage.goto(origin + studentPaths.profile);
  const details = studentPage.getByRole("form", { name: "اطلاعات فردی" });
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  await details.locator('[name="github"]').fill("https://github.com/octocat");
  const capture = studentPage.waitForRequest(
    (request) => request.method() === "POST" && Boolean(request.headers()["next-action"]),
  );
  await details.locator('button[type="submit"]').click();
  const profileRequest = await capture;
  await details.locator('[name="username"][readonly]').waitFor();
  await page.goto(origin + studentPaths.dashboard + "?student=" + studentId);
  const statusRequest = await selectAccountStatus(page, "banned");
  const [user] = await db.select().from(users).where(eq(users.id, studentId));
  assert.equal(user.academyBanned, true);
  assert.equal(user.academyActive, false);
  assert.equal(
    (await studentRankings(db, admin)).find((row) => row.studentId === otherId).overallRank,
    1,
  );
  assert.equal((await db.select().from(awards).where(eq(awards.studentId, studentId))).length, 2);
  const forbidden = await other.request.post(statusRequest.url(), {
    headers: {
      Origin: origin,
      "next-action": statusRequest.headers()["next-action"],
      "content-type": statusRequest.headers()["content-type"],
    },
    data: statusRequest.postDataBuffer(),
  });
  assert.match(await forbidden.text(), /forbidden/);
  await checkBannedAccess(fixture, student, profileRequest);
  await studentPage.clock.fastForward(60_100);
  await studentPage.waitForURL(origin + studentPaths.signIn + "?notice=banned");
  await studentPage.getByText(accountCopy.fa.bannedDescription, { exact: true }).waitFor();
  assert.equal(await studentPage.locator(".student-dashboard").count(), 0);
  await studentPage.screenshot({ path: ".backup/student-banned-existing-session.png" });
  await delay(10_100);
  assert.equal((await login(guest, username, "IncorrectPassword!987")).status(), 401);
  const guestPage = await guest.newPage();
  await guestPage.goto(origin + studentPaths.signIn);
  await guestPage.locator('[name="username"]').fill(username);
  await guestPage.locator('[name="password"]').fill(password);
  const attempted = guestPage.waitForResponse(
    (response) =>
      response.request().method() === "POST" && /\/sign-in\/username\/$/.test(response.url()),
  );
  await guestPage.locator('.student-login button[type="submit"]').click();
  const response = await attempted;
  assert.equal(response.status(), 403);
  assert.equal((await response.json()).code, accountBannedCode);
  await guestPage.getByText(accountCopy.fa.bannedDescription, { exact: true }).waitFor();
  assert.equal(await (await guest.request.get(origin + "/api/auth/get-session/")).json(), null);
  const a11y = await new AxeBuilder({ page: guestPage }).withTags(["wcag2a", "wcag2aa"]).analyze();
  assert.deepEqual(
    a11y.violations.map((issue) => issue.id),
    [],
  );
  await guestPage.screenshot({ path: ".backup/student-banned-login.png" });
  await selectAccountStatus(page, "inactive");
  assert.equal((await db.select().from(sessions).where(eq(sessions.userId, studentId))).length, 0);
  assert.equal(await (await student.request.get(origin + "/api/auth/get-session/")).json(), null);
  assert.equal((await login(guest, username)).status(), 200);
  await guestPage.goto(origin + studentPaths.history);
  await guestPage.locator(".student-history").waitFor();
  assert.equal(
    (await studentRankings(db, admin)).some((row) => row.studentId === studentId),
    false,
  );
  await selectAccountStatus(page, "active");
  assert.equal(
    (await studentRankings(db, admin)).find((row) => row.studentId === studentId).overallRank,
    1,
  );
  console.log(
    "PASS bans: verified-password-only rejection, clear messages, live session blocking, unchanged history, admin-only updates and mandatory fresh sign-in after unbanning",
  );
} finally {
  await student?.close();
  await other?.close();
  await guest?.close();
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
