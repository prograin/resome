import assert from "node:assert/strict";
import { studentPaths } from "../../src/lib/student-auth/paths.js";

export function studentHelpers({ page, username, origin, login }) {
  async function submit(value, account = username) {
    await page.locator('[name="username"]').fill(account);
    await page.locator('[name="password"]').fill(value);
    await page.locator('.student-panel button[type="submit"]').click();
  }
  async function signOut() {
    const button = page.getByRole("button", { name: "خروج از حساب" });
    if (new URL(page.url()).pathname !== studentPaths.profile) {
      assert.equal(await button.count(), 0);
      const menu = page.locator("#academyMenuButton");
      if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) === "false")
        await menu.click();
      const profileLink = page
        .locator(".student-sidebar")
        .getByRole("link", { name: "پروفایل", exact: true });
      const href = await profileLink.getAttribute("href");
      assert.ok(href.startsWith(studentPaths.profile));
      await profileLink.click();
      await page.waitForURL(origin + href);
    }
    await button.click();
    await page.waitForURL(login);
  }

  async function openDashboardPage(name) {
    const menu = page.locator("#academyMenuButton");
    if ((await menu.isVisible()) && (await menu.getAttribute("aria-expanded")) === "false") {
      await menu.click();
    }
    await page.locator(".student-sidebar").getByRole("link", { name, exact: true }).click();
  }
  async function checkHistoryNote(row, text) {
    await page
      .locator(".student-history tbody tr")
      .nth(row)
      .getByRole("button", { name: "نمایش توضیحات" })
      .click();
    const dialog = page.getByRole("dialog", { name: "توضیحات امتیاز" });
    await dialog.getByText(text, { exact: true }).waitFor();
    await page.keyboard.press("Escape");
    await dialog.waitFor({ state: "hidden" });
  }
  return { submit, signOut, openDashboardPage, checkHistoryNote };
}
