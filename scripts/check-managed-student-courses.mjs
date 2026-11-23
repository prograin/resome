import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { and, eq } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createPreferenceContext } from "./lib/browser-preferences.mjs";
import { selectOption } from "./lib/select-option.mjs";
import { courses, awards, courseDefinitions } from "../src/lib/db/schema/index.js";
import { writeAdminCourse } from "../src/lib/db/admin-courses.js";
import { studentPaths } from "../src/lib/student-auth/paths.js";

const database = await createTestDatabase("managed_student_courses");
let fixture, student;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { db } = database;
  const { page, origin, context, browser, admin, password, username, studentId, otherId } = fixture;
  const definitions = await db
    .insert(courseDefinitions)
    .values([
      { title: "Managed course A" },
      { title: "Managed course B" },
      { title: "Managed ungraded" },
    ])
    .returning();
  for (const definition of definitions) {
    for (const id of [studentId, otherId]) {
      assert.equal(
        await writeAdminCourse(db, admin, definition.id, "enroll", null, { studentId: id }),
        "saved",
      );
      if (definition.id === definitions[2].id) continue;
      const [course] = await db
        .select()
        .from(courses)
        .where(and(eq(courses.studentId, id), eq(courses.definitionId, definition.id)));
      await db.insert(awards).values({
        studentId: id,
        courseId: course.id,
        points: id === otherId ? 4 : definition.id === definitions[0].id ? 5 : 3,
        kind: "session",
      });
    }
  }
  const login = async (target, name) => {
    const result = await target.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: name, password },
    });
    assert.equal(result.status(), 200);
  };
  await login(context, admin);
  student = await browser.newContext();
  await login(student, username);
  const url = origin + studentPaths.dashboard + "?student=" + studentId;
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(url);
  const table = page.locator("[data-student-courses]");
  const rows = table.locator("tbody tr");
  await rows.first().waitFor();
  assert.equal(await rows.count(), 3);
  const first = rows.filter({ hasText: "Managed course A" });
  assert.equal(await first.locator('[data-label="میانگین نمره"]').innerText(), "۵");
  assert.equal(await first.locator('[data-label="رتبه در دوره"]').innerText(), "۱");
  assert.equal(
    await rows
      .filter({ hasText: "Managed course B" })
      .locator('[data-label="رتبه در دوره"]')
      .innerText(),
    "۲",
  );
  assert.equal(
    await rows
      .filter({ hasText: "Managed ungraded" })
      .locator('[data-label="میانگین نمره"]')
      .innerText(),
    "—",
  );
  const average = table.getByRole("columnheader", { name: "میانگین نمره", exact: true });
  await average.getByRole("button").click();
  assert.match(await rows.first().innerText(), /Managed course B/);
  await average.getByRole("button").click();
  assert.match(await rows.first().innerText(), /Managed course A/);
  const capture = page.waitForRequest(
    (request) => request.method() === "POST" && Boolean(request.headers()["next-action"]),
  );
  await selectOption(first, "status", "inactive");
  const request = await capture;
  await first.locator('[data-enrollment-status="inactive"]').waitFor();
  const readStatus = async (id) =>
    (
      await db
        .select()
        .from(courses)
        .where(and(eq(courses.studentId, id), eq(courses.definitionId, definitions[0].id)))
    )[0].status;
  assert.equal(await readStatus(studentId), "inactive");
  assert.equal(await readStatus(otherId), "active");
  const denied = await student.request.post(request.url(), {
    headers: {
      Origin: origin,
      "next-action": request.headers()["next-action"],
      "content-type": request.headers()["content-type"],
    },
    data: request.postDataBuffer(),
  });
  assert.match(await denied.text(), /forbidden/);
  for (const status of ["completed", "active"]) {
    await selectOption(first, "status", status);
    await first.locator(`[data-enrollment-status="${status}"]`).waitFor();
    assert.equal(await readStatus(studentId), status);
  }
  const intercept = (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 503, contentType: "text/plain", body: "Unavailable" })
      : route.continue();
  await page.route("**/*", intercept);
  try {
    await selectOption(first, "status", "inactive");
    await first.locator('[data-status="failed"][role="alert"]').waitFor();
    assert.equal(await first.locator('[name="status"]').inputValue(), "active");
    assert.equal(await readStatus(studentId), "active");
  } finally {
    await page.unroute("**/*", intercept);
  }
  await selectOption(first, "status", "inactive");
  await first.locator('[data-enrollment-status="inactive"]').waitFor();
  await page.reload();
  await first.locator('[data-enrollment-status="inactive"]').waitFor();
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await table.scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const result = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    assert.deepEqual(
      result.violations.map((issue) => issue.id),
      [],
    );
    await page.screenshot({ path: `.backup/managed-student-courses-${width}.png` });
  }
  const empty = await createPreferenceContext(browser, { locale: "en", theme: "dark" });
  try {
    await login(empty, admin);
    const emptyPage = await empty.newPage();
    await emptyPage.goto(url);
    await emptyPage
      .locator("[data-student-courses]")
      .getByRole("heading", { name: "Student courses" })
      .waitFor();
  } finally {
    await empty.close();
  }
  console.log(
    "PASS managed student courses: averages/ranks, sortable responsive table, all status transitions, persistence, failed-request recovery and admin-only changes",
  );
} finally {
  await student?.close();
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
