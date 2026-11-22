import { seedManagementGoals } from "./students/management-fixtures.mjs";
import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { studentPaths } from "../src/lib/student-auth/paths.js";
import { createDatabase } from "../src/lib/db/client.js";
import { readAcademyAdmin } from "../src/lib/db/academy-admin.js";
import { createStudentInput } from "../src/lib/validation/admin.js";
import { checkAdminCourseWorkflow } from "./students/admin-courses.mjs";

const database = await createTestDatabase("academy_admin");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { page, context, browser, origin, password, admin, username, studentId } = fixture;
  const url = origin + studentPaths.admin;
  await page.goto(url);
  await page.waitForURL(origin + studentPaths.signIn);
  const login = async (target, account) => {
    const response = await target.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: account, password },
    });
    assert.equal(response.status(), 200);
  };
  const student = await browser.newContext();
  await login(student, username);
  const denied = await student.request.get(url);
  assert.match(await denied.text(), /NEXT_HTTP_ERROR_FALLBACK;404/);
  await login(context, admin);
  const response = await page.goto(origin + studentPaths.dashboard);
  await page.waitForURL(url);
  assert.equal(response.status(), 200);
  await page.getByRole("heading", { name: "مدیریت آکادمی", exact: true }).waitFor();
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  const rows = page.locator(".academy-admin__directory tbody tr");
  assert.equal(await rows.count(), 2);
  assert.ok(!(await rows.allTextContents()).some((text) => text.includes(admin)));
  const navigation = page.locator("#student-dashboard-nav");
  const readNavigation = () =>
    navigation.locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  const adminLinks = await readNavigation();
  assert.deepEqual(
    [...adminLinks].sort(),
    [
      studentPaths.admin,
      studentPaths.adminStudents,
      studentPaths.adminCourses,
      studentPaths.links,
      studentPaths.notifications,
      studentPaths.profile,
    ].sort(),
  );
  assert.equal(
    await navigation
      .locator(`a[href="${studentPaths.adminStudents}"] svg`)
      .getAttribute("data-lucide"),
    "users",
  );
  const menu = page.locator("#academyMenuButton");
  if (await menu.isVisible()) await menu.click();
  await navigation.locator(`a[href="${studentPaths.adminStudents}"]`).click();
  await page.waitForURL(origin + studentPaths.adminStudents);
  await seedManagementGoals(studentId);
  await rows.locator(`a[href="${studentPaths.dashboard}?student=${studentId}"]`).click();
  await page.locator(".student-chart__metrics").waitFor();
  assert.equal(await page.locator(".student-chart__average").count(), 4);
  assert.equal(await page.locator(".student-dashboard-goals tbody tr").count(), 3);
  assert.equal(
    await page
      .locator(
        '.student-progress input[name="title"], .student-progress select[name="status"], .student-chart__graph',
      )
      .count(),
    0,
  );
  assert.deepEqual(
    await navigation
      .locator("a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href"))),
    adminLinks,
  );
  await page.locator(`a[href="${studentPaths.goals}?student=${studentId}"]`).click();
  await page.locator('li[id^="goal-"]').first().waitFor();
  assert.equal(await page.locator('li[id^="goal-"]').count(), 5);
  assert.equal(await page.locator(".student-goal__action").count(), 0);
  assert.deepEqual(await readNavigation(), adminLinks);
  await page.goto(url);
  await rows.first().waitFor();
  const search = page.locator(".academy-admin__search");
  await search.locator('[name="q"]').fill("not-present");
  await search.getByRole("button", { name: "جست‌وجو", exact: true }).click();
  await page.getByText("شاگردی پیدا نشد.", { exact: true }).waitFor();
  await page.getByRole("link", { name: "پاک‌کردن جست‌وجو" }).click();
  await rows.first().waitFor();
  const created = "new_" + Date.now();
  const create = async (account) => {
    await page.getByRole("button", { name: "افزودن شاگرد" }).click();
    const dialog = page.getByRole("dialog", { name: "افزودن شاگرد" });
    await dialog.locator('[name="firstName"]').fill("New Academy");
    assert.equal(await dialog.locator('[name="email"]').count(), 0);
    await dialog.locator('[name="lastName"]').fill("Student");
    await dialog.locator('[name="username"]').fill(account);
    await dialog.locator('[name="password"]').fill(password);
    const posted = page.waitForRequest((req) => req.method() === "POST" && req.url() === url);
    await dialog.getByRole("button", { name: "ساخت حساب", exact: true }).click();
    return { dialog, request: await posted };
  };
  const { dialog, request } = await create(created);
  await dialog.waitFor({ state: "hidden" });
  await rows.filter({ hasText: created }).waitFor();
  assert.equal(await rows.count(), 3);
  const session = await (await context.request.get(origin + "/api/auth/get-session/")).json();
  assert.equal(
    session.user.username,
    admin,
    "creating a student must not replace the admin session",
  );
  const replay = await student.request.post(url, {
    headers: {
      Origin: origin,
      "next-action": request.headers()["next-action"],
      "content-type": request.headers()["content-type"],
    },
    data: request.postDataBuffer(),
  });
  assert.match(await replay.text(), /forbidden/, "student cannot invoke account creation directly");
  const duplicate = await create(created);
  await duplicate.dialog.getByRole("alert").filter({ hasText: "قبلاً ثبت شده" }).waitFor();
  await page.keyboard.press("Escape");
  const newcomer = await browser.newContext();
  await login(newcomer, created);
  const newSession = await (await newcomer.request.get(origin + "/api/auth/get-session/")).json();
  assert.equal(newSession.user.firstName, "New Academy");
  assert.equal(newSession.user.lastName, "Student");
  const profile = await newcomer.newPage();
  await profile.goto(origin + studentPaths.profile);
  assert.equal(await profile.locator('[name="email"]').inputValue(), "");
  assert.match(await (await newcomer.request.get(url)).text(), /NEXT_HTTP_ERROR_FALLBACK;404/);
  await newcomer.close();
  await checkAdminCourseWorkflow({ page, origin, student, studentId, username });
  await page.goto(url);
  for (const locale of ["fa", "en"]) {
    for (const theme of ["light", "dark"]) {
      for (const width of [390, 1440]) {
        await page.evaluate(
          ({ locale, theme }) => {
            localStorage.setItem("portfolio_locale", locale);
            localStorage.setItem("academy_theme", theme);
          },
          { locale, theme },
        );
        await page.setViewportSize({ width, height: 960 });
        await page.reload();
        await rows.first().waitFor();
        const previous = page.locator(".academy-admin__pagination-previous");
        const next = page.locator(".academy-admin__pagination-next");
        assert.equal((await previous.innerText()).trim(), "");
        assert.equal((await next.innerText()).trim(), "");
        assert.equal(
          await previous.locator("svg").getAttribute("data-rendered-icon"),
          locale === "fa" ? "chevron-right" : "chevron-left",
        );
        assert.equal(
          await next.locator("svg").getAttribute("data-rendered-icon"),
          locale === "fa" ? "chevron-left" : "chevron-right",
        );
        assert.ok(
          await page
            .locator(".academy-admin__directory > .student-table__filter-divider")
            .isVisible(),
        );
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        const result = await new AxeBuilder({ page })
          .include("main")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        assert.deepEqual(
          result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })),
          [],
          `${locale} ${theme} ${width}`,
        );
      }
    }
  }
  await page.locator(`a[href="${studentPaths.dashboard}?student=${studentId}"]`).click();
  await page.locator("#progress-admin-title").waitFor();
  await student.close();

  const { db, pool } = createDatabase(database.url);
  try {
    assert.equal((await readAcademyAdmin(db, admin)).summary.students, 3);
    assert.equal(
      (await readAcademyAdmin(db, admin, { q: "%" })).total,
      0,
      "literal wildcard search",
    );
    const filtered = await readAcademyAdmin(db, admin, { q: created, page: "9999" });
    assert.equal(filtered.total, 1);
    assert.equal(filtered.page, 1);
    assert.ok(!("password" in filtered.students[0]));
    assert.equal(
      createStudentInput.safeParse({
        username: "bad space",
        password: "short",
        email: "bad",
        name: "",
      }).success,
      false,
    );
  } finally {
    await pool.end();
  }
  console.log(
    "PASS admin-only access, account creation, duplicate handling, session preservation, action authorization, search, pagination and responsive accessible UI.",
  );
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
