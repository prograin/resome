import assert from "node:assert/strict";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { checkAcademyDepth } from "./lib/academy-depth.mjs";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const browser = await chromium.launch({ channel: "msedge" });
const failures = [];
let authenticated;
try {
  if (process.env.STUDENT_TEST_USERNAME && process.env.STUDENT_TEST_PASSWORD) {
    const page = await browser.newPage();
    await page.goto(`${origin}/academy/students/`);
    await page.locator('[name="username"]').fill(process.env.STUDENT_TEST_USERNAME);
    await page.locator('[name="password"]').fill(process.env.STUDENT_TEST_PASSWORD);
    await page.locator('.student-panel button[type="submit"]').click();
    await page.waitForURL("**/academy/students/dashboard/");
    await page.locator(".student-summary:visible").waitFor();
    authenticated = await page.context().storageState();
    await page.context().close();
  }
  for (const locale of ["fa", "en"]) {
    for (const theme of ["light", "dark"]) {
      for (const width of [360, 768, 1440]) {
        const context = await browser.newContext({
          viewport: { width, height: 960 },
          reducedMotion: "reduce",
        });
        await context.addInitScript(
          ({ locale, theme }) => {
            localStorage.setItem("portfolio_locale", locale);
            localStorage.setItem("portfolio_theme", theme);
          },
          { locale, theme },
        );
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (error) => errors.push(error.message));
        for (const path of ["/academy/", "/academy/consultation/", "/academy/students/"]) {
          await page.goto(origin + path);
          await page.getByRole("main").waitFor();
          await page.evaluate(() => document.fonts.ready);
          assert.ok(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            `${path} ${width}: overflow`,
          );
          await checkAcademyDepth(page);
          if (path.includes("consultation")) {
            if (width < 768) {
              await page.locator('[data-academy-tab="group"]').click();
              assert.ok(await page.locator('[data-academy-plan="group"]').isVisible());
            }
            await page.locator("[data-academy-details]:visible").first().click();
            const dialog = page.getByRole("dialog");
            await dialog.waitFor();
            assert.ok(
              await dialog.evaluate((node) => getComputedStyle(node).boxShadow.includes("inset")),
            );
            await checkAcademyDepth(page);
            await page.keyboard.press("Escape");
            await dialog.waitFor({ state: "hidden" });
          }
          if (width !== 768) {
            const result = await new AxeBuilder({ page })
              .include("main")
              .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
              .analyze();
            if (result.violations.length)
              failures.push({
                path,
                width,
                locale,
                theme,
                issues: result.violations.map((item) => ({
                  id: item.id,
                  targets: item.nodes.map((node) => node.target),
                })),
              });
          }
        }
        if (authenticated) {
          await context.addCookies(authenticated.cookies);
          for (const view of ["", "courses/", "goals/", "chart/", "history/", "profile/"]) {
            await page.goto(`${origin}/academy/students/dashboard/${view}`);
            await page.locator(".student-progress__header:visible").waitFor();
            assert.ok(
              await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
              `${view} ${width}: overflow`,
            );
            await checkAcademyDepth(page);
            if (width !== 768) {
              const result = await new AxeBuilder({ page })
                .include("main")
                .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
                .analyze();
              if (result.violations.length)
                failures.push({
                  view,
                  width,
                  locale,
                  theme,
                  issues: result.violations.map((item) => ({
                    id: item.id,
                    targets: item.nodes.map((node) => node.target),
                  })),
                });
            }
          }
        }
        assert.deepEqual(errors, []);
        await context.close();
      }
    }
  }
  assert.deepEqual(failures, [], "Academy accessibility regressions");
  console.log(
    "PASS academy: responsive layouts, both locales/themes, alternating neumorphic depth, dialogs, student pages and accessibility.",
  );
} finally {
  await browser.close();
}
