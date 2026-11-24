import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createStudentContext } from "./lib/student-browser-context.mjs";
import { seedActivityData, checkInactiveActivityData } from "./students/activity-data.mjs";
import { studentPaths } from "../src/lib/student-auth/paths.js";
import { users } from "../src/lib/db/schema/index.js";
import { studentRankings } from "../src/lib/db/rankings.js";
import { legacyUsers, migrateBefore } from "./lib/previous-schema.mjs";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { createDatabase } from "../src/lib/db/client.js";
import { selectAccountStatus } from "./students/account-status.mjs";
import { accountCopy } from "../src/features/students/account-copy.js";

const database = await createTestDatabase("student_activity");
let fixture, studentContext;
try {
  const legacy = createDatabase(database.url);
  try {
    await migrateBefore(legacy.db, 14);
    await legacy.db.insert(legacyUsers).values({
      id: "legacy_activity",
      name: "Existing student",
      email: "legacy_activity@example.test",
    });
    await migrateStudentDatabase(legacy.db);
  } finally {
    await legacy.pool.end();
  }
  assert.equal(
    (await database.db.select().from(users).where(eq(users.id, "legacy_activity")))[0]
      .academyActive,
    true,
  );
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { page, origin, context, browser, admin, username, password, studentId } = fixture;
  const { db } = database;
  await seedActivityData(db, fixture);
  const login = async (target, account) => {
    const result = await target.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: account, password },
    });
    assert.equal(result.status(), 200);
  };
  studentContext = await createStudentContext(browser, { viewport: { width: 1440, height: 960 } });
  await login(studentContext, username);
  const studentPage = await studentContext.newPage();
  await studentPage.goto(origin + studentPaths.dashboard);
  await studentPage.locator(".student-chart__metrics").waitFor();
  await login(context, admin);
  await page.goto(origin + studentPaths.dashboard + "?student=" + studentId);
  const request = await selectAccountStatus(page, "inactive");
  await page.screenshot({ path: ".backup/admin-inactive-student.png" });
  assert.equal(
    (await db.select().from(users).where(eq(users.id, studentId)))[0].academyActive,
    false,
  );
  const forbidden = await studentContext.request.post(request.url(), {
    headers: {
      Origin: origin,
      "next-action": request.headers()["next-action"],
      "content-type": request.headers()["content-type"],
    },
    data: request.postDataBuffer(),
  });
  assert.match(await forbidden.text(), /forbidden/);
  await checkInactiveActivityData(db, fixture);
  await studentPage.locator(`#student-dashboard-nav a[href="${studentPaths.courses}"]`).click();
  await studentPage.waitForURL(origin + studentPaths.courses);
  await studentPage.locator(".student-course").first().waitFor();
  await studentPage.locator(`#student-dashboard-nav a[href="${studentPaths.dashboard}"]`).click();
  await studentPage.locator('[data-page="academy-dashboard"] .student-dashboard__main').waitFor();
  const notice = accountCopy.fa.inactiveDescription;
  await studentPage.getByText(notice, { exact: true }).waitFor();
  await studentPage.screenshot({ path: ".backup/student-inactive-dashboard.png" });
  assert.equal(
    await studentPage
      .locator(".student-chart__metrics, .student-chart, .student-leaderboard")
      .count(),
    0,
  );
  assert.equal(
    await studentPage.locator(`#student-dashboard-nav a[href="${studentPaths.chart}"]`).count(),
    0,
  );
  for (const width of [390, 1440]) {
    await studentPage.setViewportSize({ width, height: 960 });
    await studentPage.goto(origin + studentPaths.courses);
    await studentPage.getByRole("link", { name: "گیت‌هاب" }).first().waitFor();
    assert.equal(await studentPage.getByText("امتیاز شما:", { exact: false }).count(), 0);
    assert.equal(await studentPage.getByText("رتبه شما در دوره:", { exact: false }).count(), 0);
    const a11y = await new AxeBuilder({ page: studentPage })
      .include("main")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    assert.deepEqual(
      a11y.violations.map((issue) => issue.id),
      [],
    );
  }
  for (const path of [studentPaths.chart]) {
    const response = await studentPage.goto(origin + path);
    assert.equal(response.status(), 200);
    await studentPage.getByText(notice, { exact: true }).waitFor();
    assert.ok(!(await response.text()).includes("Private activity score note"));
    assert.equal(await studentPage.locator(".student-chart, .student-history").count(), 0);
  }
  await studentPage.goto(origin + studentPaths.history);
  await studentPage.locator(".student-history").waitFor();
  assert.ok((await studentPage.locator(".student-history").innerText()).includes("۵"));
  await studentPage.getByRole("button", { name: "نمایش توضیحات", exact: true }).first().click();
  await studentPage
    .getByRole("dialog")
    .getByText("Private activity score note", { exact: true })
    .waitFor();
  await studentPage.keyboard.press("Escape");
  await studentPage.goto(origin + studentPaths.goals);
  await studentPage.getByRole("button", { name: "افزودن هدف", exact: true }).click();
  const dialog = studentPage.getByRole("dialog");
  await dialog.locator('[name="title"]').fill("Inactive account goal");
  await dialog.locator('button[type="submit"]').click();
  await dialog.waitFor({ state: "hidden" });
  await studentPage.getByText("Inactive account goal", { exact: true }).waitFor();
  await studentPage.goto(origin + studentPaths.profile);
  const details = studentPage.getByRole("form", { name: "اطلاعات فردی" });
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  await details.locator('[name="github"]').fill("https://github.com/octocat");
  await details.evaluate((form) => {
    const field = document.createElement("input");
    field.name = "academyActive";
    field.value = "true";
    field.type = "hidden";
    form.append(field);
  });
  await details.locator('button[type="submit"]').click();
  await details.locator('[name="username"][readonly]').waitFor();
  const session = await (
    await studentContext.request.get(origin + "/api/auth/get-session/")
  ).json();
  assert.equal(session.user.academyActive, false);
  const inbox = await (
    await studentContext.request.get(origin + "/api/students/notifications/")
  ).json();
  assert.ok(inbox.items.some((item) => item.points === 5));
  await login(studentContext, username);
  for (const path of [studentPaths.links, studentPaths.password]) {
    await studentPage.goto(origin + path);
    await studentPage.locator(".student-dashboard__main").waitFor();
  }
  await selectAccountStatus(page, "active");
  assert.equal(
    (await studentRankings(db, admin)).find((row) => row.studentId === studentId).overallRank,
    1,
  );
  await studentPage.locator(`#student-dashboard-nav a[href="${studentPaths.dashboard}"]`).click();
  await studentPage.locator(".student-chart__metrics").waitFor();
  await studentPage.screenshot({ path: ".backup/student-reactivated.png" });
  console.log(
    "PASS inactive accounts: retained history/resources/features, no new scores/snapshots/ranks, clear notices and reversible activation",
  );
} finally {
  await studentContext?.close();
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
