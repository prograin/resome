import assert from "node:assert/strict";
import { webkit, devices } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createStudentContext } from "./lib/student-browser-context.mjs";
import { studentPaths } from "../src/lib/student-auth/paths.js";

const database = await createTestDatabase("student_selects");
let fixture;
let browser;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  browser = await webkit.launch();
  const context = await createStudentContext(browser, { ...devices["iPhone 13"] });
  const { origin, username, password } = fixture;
  assert.equal(
    (
      await context.request.post(origin + "/api/auth/sign-in/username/", {
        headers: { Origin: origin },
        data: { username, password },
      })
    ).status(),
    200,
  );
  const page = await context.newPage();
  await page.goto(origin + studentPaths.chart);
  const timeRange = page.getByRole("combobox", { name: "بازهٔ زمانی", exact: true });
  await timeRange.click();
  const listbox = page.getByRole("listbox");
  await listbox.waitFor();
  assert.equal(await page.getByRole("option").count(), 4);
  const background = await listbox.evaluate((node) => getComputedStyle(node).backgroundColor);
  assert.notEqual(background, "rgba(0, 0, 0, 0)");
  await page.screenshot({ path: ".backup/select-webkit-light.png" });
  await page.getByRole("option", { name: "۷ روز اخیر", exact: true }).click();
  assert.ok((await timeRange.innerText()).includes("۷ روز اخیر"));
  await page.goto(origin + studentPaths.goals);
  await page
    .locator(".student-progress__header")
    .getByRole("button", { name: "افزودن هدف", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "افزودن هدف", exact: true });
  await dialog.locator('[name="title"]').fill("WebKit select goal");
  await dialog.locator('button[data-select-name="priority"]').click();
  const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  assert.deepEqual(
    accessibility.violations.map((issue) => issue.id),
    [],
  );
  await page.screenshot({ path: ".backup/select-webkit-dialog.png" });
  await page.getByRole("option", { name: "زیاد", exact: true }).click();
  assert.equal(await dialog.locator('input[name="priority"]').inputValue(), "1");
  await dialog.getByRole("button", { name: "افزودن هدف", exact: true }).click();
  await dialog.waitFor({ state: "hidden" });
  await page.getByRole("heading", { name: "WebKit select goal", exact: true }).waitFor();
  await page.evaluate(() => localStorage.setItem("academy_theme", "dark"));
  await page.goto(origin + studentPaths.chart);
  await timeRange.click();
  await page.getByRole("listbox").waitFor();
  assert.notEqual(
    await listbox.evaluate((node) => getComputedStyle(node).backgroundColor),
    background,
  );
  await page.screenshot({ path: ".backup/select-webkit-dark.png" });
  await page.keyboard.press("Escape");
  assert.equal(await timeRange.getAttribute("aria-expanded"), "false");
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  console.log(
    "PASS WebKit mobile selects: styled options in both themes, modal interaction, real form values, keyboard dismissal and accessibility.",
  );
} finally {
  await browser?.close();
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
