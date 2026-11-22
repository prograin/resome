import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { academyApp } from "../../src/features/academy-app/paths.js";

export async function checkAcademyTheme(fixture) {
  const context = await fixture.browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addInitScript((key) => sessionStorage.setItem(key, "1"), academyApp.invitationKey);
  await context.addInitScript(() => localStorage.setItem("portfolio_theme", "light"));
  const page = await context.newPage();
  async function checkLight() {
    await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
    await page.waitForFunction(
      () => document.querySelector('meta[name="theme-color"]')?.content === "#dce5ef",
    );
    assert.equal(await page.evaluate(() => localStorage.getItem("academy_theme")), "light");
    const accessibility = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    assert.deepEqual(
      accessibility.violations.map((issue) => issue.id),
      [],
    );
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  try {
    await page.goto(fixture.origin + "/");
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    assert.equal(await page.locator("#themeToggle").count(), 0);
    await page.locator("#navAcademyPage").click();
    await page.waitForURL(fixture.origin + "/academy/");
    await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
    await page.locator("#navHomePage").click();
    await page.waitForURL(fixture.origin + "/");
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.goto(fixture.login);
    await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
    assert.equal(await page.evaluate(() => localStorage.getItem("academy_theme")), null);
    await page.locator('.site-header__standard button[aria-label="حالت تیره"]').click();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.locator('.site-header__standard button[aria-label="حالت روشن"]').click();
    await checkLight();
    await page.reload();
    await checkLight();
    await page.setViewportSize({ width: 360, height: 800 });
    await page.locator("#academyMenuButton").click();
    await page.locator('#academy-mobile-menu button[aria-label="حالت تیره"]').click();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.locator('#academy-mobile-menu button[aria-label="حالت روشن"]').click();
    await page.keyboard.press("Escape");
    await checkLight();
    await page.screenshot({ path: ".backup/academy-login-light.png" });
    const login = await context.request.post(fixture.origin + "/api/auth/sign-in/username/", {
      headers: { Origin: fixture.origin },
      data: { username: fixture.username, password: fixture.password },
    });
    assert.equal(login.status(), 200);
    await page.goto(fixture.dashboard);
    await page.locator(".student-sidebar").waitFor({ state: "attached" });
    await page.locator("#academyMenuButton").click();
    await page.locator('.student-sidebar button[aria-label="حالت تیره"]').click();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.locator('.student-sidebar button[aria-label="حالت روشن"]').click();
    await page.keyboard.press("Escape");
    await checkLight();
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.screenshot({ path: ".backup/academy-dashboard-light.png" });
    await page.locator('.site-header__standard button[aria-label="حالت تیره"]').click();
    await page.waitForFunction(
      () => document.querySelector('meta[name="theme-color"]')?.content === "#142237",
    );
    await page.reload();
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    await page.locator('.site-header__standard button[aria-label="حالت روشن"]').click();
    await page.goto(fixture.origin + "/contact/");
    await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
    assert.equal(await page.locator("#themeToggle").count(), 0);
    await page.goto(fixture.login);
    await checkLight();
    console.log(
      "PASS scoped academy themes: dark public site, isolated saved choice, client navigation, desktop/mobile controls, accessibility and app theme color.",
    );
  } finally {
    await context.close();
  }
}
