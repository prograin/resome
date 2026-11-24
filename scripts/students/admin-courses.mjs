import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { adminCourseCopy } from "../../src/features/academy-admin/course-copy.js";
import { selectOption } from "../lib/select-option.mjs";
import {
  checkAdminCourseResources,
  checkStudentCourseResources,
} from "./admin-course-resources.mjs";

export async function checkAdminCourseWorkflow({ page, origin, student, studentId, username }) {
  await page.evaluate(() => localStorage.setItem("portfolio_locale", "fa"));
  const catalog = origin + studentPaths.adminCourses;
  await page.goto(catalog);
  await page.getByRole("button", { name: "افزودن دوره", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "افزودن دوره" });
  await dialog.locator('[name="title"]').fill("Roster fixture course");
  await selectOption(dialog, "difficulty", "intermediate");
  await dialog.locator('[name="github"]').fill("https://github.com/prograin/course");
  await dialog.locator('[name="playlist"]').fill("https://www.youtube.com/playlist?list=example");
  await dialog.locator('[name="syllabus"]').fill("Basics\nAPIs");
  await dialog.getByRole("button", { name: "ثبت", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  const card = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name: "Roster fixture course", exact: true }) });
  await checkAdminCourseResources({ page, card, student, origin });
  await card.getByRole("link", { name: "شاگردها", exact: true }).click();
  await page.waitForURL(/\/admin\/courses\/\d+\/students\/$/);
  const manageUrl = page.url();
  await page.getByRole("button", { name: "افزودن شاگرد", exact: true }).click();
  const enrollment = page.getByRole("dialog", { name: "افزودن شاگرد", exact: true });
  await enrollment.getByRole("button", { name: "انصراف", exact: true }).click();
  await enrollment.waitFor({ state: "hidden" });
  await page.getByRole("button", { name: "افزودن شاگرد", exact: true }).click();
  const add = page
    .locator("form")
    .filter({ has: page.locator('button[data-multi-select-name="studentIds"]') });
  await add.locator('[data-multi-select-name="studentIds"]').click();
  await page.locator(`button[data-select-value="${studentId}"]`).click();
  await page.keyboard.press("Escape");
  await add.getByRole("button", { name: "افزودن شاگرد", exact: true }).click();
  await enrollment.waitFor({ state: "hidden" });
  const row = page
    .locator(".academy-admin__roster-row, .academy-admin__course-table tbody tr")
    .filter({ hasText: username });
  await row.waitFor();
  assert.equal(await page.locator(".student-progress .academy-admin__toolbar a").count(), 0);
  await page.goto(manageUrl.replace(/students\/$/, "grades/"));
  await page.waitForURL(/\/admin\/courses\/\d+\/grades\/$/);
  const gradesUrl = page.url();
  assert.equal(await row.getByText(adminCourseCopy.fa.scoredToday, { exact: true }).count(), 0);
  await row.locator('[name="points"]').fill("5");
  await row.locator('[name="note"]').fill("Roster note");
  const nameFilter = page.getByRole("searchbox", { name: adminCourseCopy.fa.filterName });
  await nameFilter.fill("no matching student");
  assert.equal(await row.isVisible(), false);
  await page.getByText(adminCourseCopy.fa.noMatches, { exact: true }).waitFor();
  await nameFilter.fill((await row.locator("h2").textContent()).trim());
  assert.equal(await row.isVisible(), true);
  assert.equal(await row.locator('[name="points"]').inputValue(), "5");
  assert.equal(await row.locator('[name="note"]').inputValue(), "Roster note");
  await nameFilter.fill("");
  const posted = page.waitForRequest((r) => r.method() === "POST" && r.url() === gradesUrl);
  await row.getByRole("button", { name: "ثبت", exact: true }).click();
  const request = await posted;
  await row.getByRole("status").waitFor();
  await row.getByText(adminCourseCopy.fa.scoredToday, { exact: true }).waitFor();
  const denied = await student.request.post(gradesUrl, {
    headers: {
      Origin: origin,
      "next-action": request.headers()["next-action"],
      "content-type": request.headers()["content-type"],
    },
    data: request.postDataBuffer(),
  });
  assert.match(await denied.text(), /forbidden/);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 960 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const result = await new AxeBuilder({ page })
      .include("main")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    assert.deepEqual(
      result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })),
      [],
    );
  }
  await page.goto(manageUrl);
  assert.equal(await row.locator('[data-label="میانگین نمره"]').innerText(), "۵");
  assert.equal(await row.locator('[data-label="رتبه در دوره"]').innerText(), "۱");
  for (const label of ["میانگین نمره", "رتبه در دوره"]) {
    const column = page.getByRole("columnheader", { name: label, exact: true });
    await column.getByRole("button").click();
    assert.equal(await column.getAttribute("aria-sort"), "ascending");
    await column.getByRole("button").click();
    assert.equal(await column.getAttribute("aria-sort"), "descending");
  }
  await row.getByRole("button", { name: "اتمام دوره", exact: true }).click();
  await row.getByRole("button", { name: "فعال‌کردن دوباره", exact: true }).waitFor();
  assert.equal(await row.getByRole("status").count(), 0);
  await page.goto(gradesUrl);
  await page.getByText(adminCourseCopy.fa.emptyActive, { exact: true }).waitFor();
  const studentPage = await student.newPage();
  await studentPage.goto(origin + studentPaths.courses);
  await studentPage.getByRole("heading", { name: "Roster fixture course", exact: true }).waitFor();
  await checkStudentCourseResources(studentPage);
  await studentPage.close();
  await page.goto(manageUrl);
  await row.getByRole("button", { name: "فعال‌کردن دوباره", exact: true }).click();
  await row.getByRole("button", { name: "اتمام دوره", exact: true }).waitFor();
  await selectOption(row, "status", "inactive");
  await row.locator('button[data-enrollment-status="inactive"]').waitFor();
  assert.equal(
    await row.getByRole("button", { name: "امتیاز دادن", exact: true }).isDisabled(),
    true,
  );
  assert.equal(await row.getByRole("status").count(), 0);
  await selectOption(row, "status", "active");
  await row.locator('button[data-enrollment-status="active"]').waitFor();
  await row.getByRole("button", { name: "امتیاز دادن", exact: true }).click();
  const gradeDialog = page.getByRole("dialog", { name: "ثبت امتیاز", exact: true });
  await gradeDialog.locator('[name="points"]').fill("4");
  await gradeDialog.locator('[name="note"]').fill("Grade from course students table");
  await gradeDialog.getByRole("button", { name: "ثبت", exact: true }).click();
  await gradeDialog.waitFor({ state: "hidden" });
  assert.equal(
    await row.locator('[data-label="میانگین نمره"]').innerText(),
    new Intl.NumberFormat("fa").format(4.5),
  );
}
