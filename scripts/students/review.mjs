import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { studentPaths } from "../../src/lib/student-auth/paths.js";

export async function checkStudentReview({
  page,
  goal,
  courseCard,
  origin,
  dashboard,
  courses,
  password,
  other,
  studentId,
  otherId,
  signOut,
  submit,
  openDashboardPage,
  checkHistoryNote,
}) {
  await signOut();
  // Better Auth allows three sign-in attempts per IP in ten seconds.
  await delay(10_100);
  await submit(password);
  await page.waitForURL(dashboard);
  await page.locator(".student-chart__average-value").first().waitFor();
  assert.equal(await page.locator("#progress-admin-title").count(), 0);
  const metrics = await page.locator(".student-chart__average-value").allTextContents();
  assert.equal(metrics.length, 4);
  assert.equal(metrics[0], new Intl.NumberFormat("fa", { maximumFractionDigits: 2 }).format(8 / 3));
  assert.equal(metrics[3], "۳");
  // The scratch database can contain other students from previous runs.
  assert.match(metrics[1], /^[۰-۹]+$/);
  assert.equal(metrics[2], "—");
  assert.equal(await page.locator("#progress-history").count(), 0);
  assert.equal(await page.getByText("Updated goal description", { exact: true }).count(), 0);
  const goalSummary = page.locator(".student-dashboard-goals tbody tr");
  assert.equal(await goalSummary.count(), 1);
  assert.equal(await goalSummary.getByRole("progressbar").getAttribute("aria-valuenow"), "45");
  const viewGoal = goalSummary.getByRole("button", { name: "مشاهده: Fixture learning goal" });
  assert.ok((await viewGoal.boundingBox()).height <= 36);
  await viewGoal.click();
  const preview = page.getByRole("dialog", { name: "Fixture learning goal", exact: true });
  await preview.getByText("Updated goal description", { exact: true }).waitFor();
  assert.equal(page.url(), dashboard);
  assert.equal(await preview.getByRole("progressbar").getAttribute("aria-valuenow"), "45");
  await page.screenshot({ path: ".backup/goal-preview-mobile.png" });
  await preview.getByRole("button", { name: "ویرایش", exact: true }).click();
  await preview.locator('[name="description"]').fill("Goal updated from dashboard");
  await preview.getByRole("button", { name: "ذخیره", exact: true }).click();
  await preview.waitFor({ state: "hidden" });
  assert.equal(page.url(), dashboard);
  await viewGoal.click();
  await preview.getByText("Goal updated from dashboard", { exact: true }).waitFor();
  await page.keyboard.press("Escape");
  await preview.waitFor({ state: "hidden" });
  await page.goto(dashboard);
  const chart = page.getByRole("img", { name: "نمودار امتیازها" });
  await chart.waitFor();
  await page.waitForFunction(() => {
    const canvas = document.querySelector(".student-progress__plot canvas");
    return canvas
      ?.getContext("2d")
      .getImageData(0, 0, canvas.width, canvas.height)
      .data.some(Boolean);
  });
  const sidebar = page.locator(".student-sidebar__panel");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 850 });
    const mobile = width < 768;
    const compact = await sidebar.boundingBox();
    const main = page.locator(".student-dashboard__main");
    const mainWidth = (await main.boundingBox()).width;
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const current = await page.locator(".student-summary__course").boundingBox();
    const goalsBox = await page.locator(".student-dashboard-goals").boundingBox();
    if (mobile) assert.ok(goalsBox.y > current.y);
    else {
      assert.ok(current.x > goalsBox.x);
      assert.ok(Math.abs(current.y - goalsBox.y) < 2);
    }
    if (mobile) assert.equal(compact, null);
    if (mobile) await page.locator("#academyMenuButton").click();
    const expanded = await sidebar.boundingBox();
    assert.equal((await main.boundingBox()).width, mainWidth);
    if (mobile) {
      assert.ok(Math.abs(expanded.y - 12) < 1);
      assert.ok(Math.abs(width - expanded.x - expanded.width - 12) < 1);
      const close = await sidebar.locator(".student-sidebar__toggle").boundingBox();
      const brand = await sidebar.locator(".site-wordmark").boundingBox();
      assert.ok(close.x + close.width < brand.x);
    } else {
      assert.deepEqual(expanded, compact);
      assert.equal(await sidebar.locator(".student-sidebar__toggle").isVisible(), false);
    }
    if (mobile) await sidebar.locator(".student-sidebar__toggle").click();
    assert.equal((await sidebar.boundingBox())?.width, compact?.width);
    await page.screenshot({ path: `.backup/dashboard-tasks-5-10-${width}.png`, fullPage: true });
  }
  await openDashboardPage("دوره‌ها");
  await page.waitForURL(courses);
  assert.match(await page.getByRole("list", { name: "دوره‌ها" }).innerText(), /۴/);
  assert.equal(
    await page.getByRole("link", { name: "دوره‌ها", exact: true }).getAttribute("aria-current"),
    "page",
  );
  assert.equal(await page.locator("#progress-chart").count(), 0);
  assert.equal(await courseCard.getByRole("button", { name: "ویرایش دوره" }).count(), 0);
  await courseCard.getByRole("button", { name: "لینک ویدیوها" }).click();
  const videos = page.getByRole("dialog", { name: "لینک ویدیوها" });
  await videos.getByText("Fixture video description", { exact: true }).waitFor();
  assert.equal(
    await videos.getByRole("link").getAttribute("href"),
    "https://video.cs50.io/JP7ITIXGpHk",
  );
  await page.keyboard.press("Escape");
  await videos.waitFor({ state: "hidden" });
  await courseCard.getByRole("button", { name: "سرفصل‌ها" }).click();
  const syllabus = page.getByRole("dialog", { name: "سرفصل‌ها" });
  assert.deepEqual(await syllabus.getByRole("listitem").allTextContents(), [
    "Functions",
    "Databases",
  ]);
  await page.keyboard.press("Escape");
  await syllabus.waitFor({ state: "hidden" });
  await page.goto(dashboard + "?student=" + otherId);
  assert.equal(await page.getByText("Fixture follow-up", { exact: true }).count(), 0);
  await page.goto(origin + studentPaths.history + "?student=" + otherId);
  await checkHistoryNote(2, "Fixture follow-up");
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  await page.goto(origin + studentPaths.goals + "?student=" + otherId);
  await goal.getByText(/پیشرفت:.*۴۵/).waitFor();
  assert.equal(await goal.getByRole("progressbar").count(), 1);

  await signOut();
  await submit(password, other);
  await page.waitForURL(dashboard);
  await page.goto(dashboard + "?student=" + studentId);
  assert.equal(await page.locator("#progress-admin-title").count(), 0);
  assert.equal(await page.getByText("Fixture follow-up", { exact: true }).count(), 0);
  assert.equal(await page.getByText("Fixture Course", { exact: true }).count(), 0);
  await page.goto(origin + studentPaths.history + "?student=" + studentId);
  assert.equal(await page.getByText("Fixture follow-up", { exact: true }).count(), 0);
  await page.getByText("هنوز امتیازی ثبت نشده.", { exact: true }).waitFor();
  await page.goto(courses + "?student=" + studentId);
  await page.getByText("هنوز دوره‌ای اضافه نشده.", { exact: true }).waitFor();
  await page.goto(origin + studentPaths.goals + "?student=" + studentId);
  await page.getByText("هنوز هدفی ثبت نشده.", { exact: true }).waitFor();
}
