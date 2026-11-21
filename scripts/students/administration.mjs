import { seedManagedCourse } from "./management-fixtures.mjs";
import assert from "node:assert/strict";
import { studentPaths } from "../../src/lib/student-auth/paths.js";

export async function checkAdministration({
  page,
  goal,
  origin,
  login,
  dashboard,
  password,
  admin,
  studentId,
  signOut,
  submit,
  checkHistoryNote,
}) {
  await signOut();
  await page.goto(dashboard);
  await page.waitForURL(login);

  const definitionId = await seedManagedCourse();
  await submit(password, admin);
  await page.waitForURL(origin + studentPaths.admin);
  await page.locator(`a[href="${studentPaths.dashboard}?student=${studentId}"]`).click();
  await page.waitForURL(dashboard + "?student=" + studentId);

  const award = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "ثبت امتیاز" }) });
  const save = async (form) => {
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          response.url().startsWith(origin) &&
          response.status() === 200,
      ),
      form.getByRole("button", { name: "ذخیره" }).click(),
    ]);
    await form.locator('button[type="submit"]:not(:disabled)').waitFor();
  };
  await page.getByRole("button", { name: "افزودن به دوره", exact: true }).click();
  const enrollmentDialog = page.getByRole("dialog", { name: "افزودن به دوره", exact: true });
  const enrollment = enrollmentDialog.locator("form");
  assert.equal(await page.locator('input[name="title"], select[name="status"]').count(), 0);
  await enrollment.locator('[name="definitionId"]').selectOption(String(definitionId));
  await enrollment.getByRole("button", { name: "افزودن به دوره", exact: true }).click();
  await enrollmentDialog.waitFor({ state: "hidden" });
  const courseOption = award
    .locator('select[name="course"] option')
    .getByText("Fixture Course", { exact: true });
  await courseOption.waitFor({ state: "attached" });
  const courseId = await courseOption.getAttribute("value");
  const courseCard = page.getByRole("listitem").filter({
    has: page.getByRole("heading", { name: "Fixture Course", exact: true }),
  });

  await award.locator('select[name="course"]').selectOption(courseId);
  await award.locator('input[name="points"]').fill("4");
  await award.locator('select[name="kind"]').selectOption("followup");
  await award.locator('textarea[name="note"]').fill("Fixture follow-up");
  await save(award);
  assert.equal(await page.getByText("Fixture follow-up", { exact: true }).count(), 0);
  await award.locator('select[name="course"]').selectOption("");
  await award.locator('input[name="points"]').fill("1");
  await award.locator('textarea[name="note"]').fill("Fixture general award");
  await save(award);
  assert.equal(await page.getByText("Fixture general award", { exact: true }).count(), 0);
  await award.locator('input[name="points"]').fill("3");
  await award.locator('textarea[name="note"]').fill("");
  await save(award);
  await page.goto(origin + studentPaths.history + "?student=" + studentId);
  await page.getByText("بدون توضیحات", { exact: true }).waitFor();
  assert.deepEqual(await page.locator(".student-history tbody th").allTextContents(), [
    "۳",
    "۲",
    "۱",
  ]);
  await checkHistoryNote(1, "Fixture general award");
  await checkHistoryNote(2, "Fixture follow-up");

  await page.goto(dashboard + "?student=" + studentId);
  await page
    .locator(".student-dashboard-goals")
    .getByRole("button", { name: "مشاهده: Fixture learning goal" })
    .click();
  const goalPreview = page.getByRole("dialog", { name: "Fixture learning goal", exact: true });
  await goalPreview.getByText("Updated goal description", { exact: true }).waitFor();
  assert.equal(await goalPreview.getByRole("button", { name: "ویرایش", exact: true }).count(), 0);
  assert.equal(await goalPreview.locator("form").count(), 0);
  await page.keyboard.press("Escape");
  await goalPreview.waitFor({ state: "hidden" });
  await page.goto(origin + studentPaths.goals + "?student=" + studentId);
  await goal.getByText(/اولویت.*زیاد/).waitFor();
  await goal.getByText("Updated goal description", { exact: true }).waitFor();
  assert.equal(await goal.locator("form").count(), 0);
  assert.equal(await goal.getByRole("button").count(), 0);
  assert.equal(await goal.getByRole("progressbar").getAttribute("aria-valuenow"), "45");

  return courseCard;
}
