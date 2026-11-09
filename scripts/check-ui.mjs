// Responsive, bilingual UI and interaction checks; optional Playwright/axe runner.
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const origin = process.env.SITE_URL || "http://127.0.0.1:4173";
const output = new URL("../.backup/qa/", import.meta.url);
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "msedge", headless: true });
const report = [];
try {
  for (const width of [360, 768, 1024, 1440]) {
    for (const locale of ["fa", "en"]) {
      for (const theme of ["dark", "light"]) {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
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
        page.on("response", (response) => {
          if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        for (const route of ["", "order/", "academy/", "contact/", "resume/"]) {
          await page.goto(`${origin}/${route}`);
          await page.waitForLoadState("networkidle");
          const label = `${width} ${locale} ${theme} /${route}`;
          const visible = page.locator("[data-page]:not(.hidden)");
          assert.equal(await visible.locator("h1").count(), 1, label);
          assert.equal(await page.evaluate(() => scrollY), 0, `Initial scroll: ${label}`);
          assert.equal(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            true,
            label,
          );
          assert.equal(
            await page.evaluate(() => {
              const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
              return ids.length === new Set(ids).size;
            }),
            true,
            `Duplicate IDs: ${label}`,
          );
          assert.equal(
            await page
              .locator("svg[data-lucide]")
              .evaluateAll(
                (icons) =>
                  icons.filter(
                    (icon) =>
                      icon.dataset.lucide !== "circle" &&
                      icon.innerHTML === '<circle cx="12" cy="12" r="9"></circle>',
                  ).length,
              ),
            0,
            `Missing icon: ${label}`,
          );

          if (route === "order/") {
            assert.equal(await page.locator("[data-pricing-card]").count(), 6);
            const buttons = page.locator("[data-pricing-toggle]");
            for (const button of await buttons.all()) {
              const card = button.locator("xpath=..");
              await button.click();
              assert.equal(
                await page.locator("#modalOverlay").getAttribute("aria-hidden"),
                "false",
              );
              assert.equal(
                await page.locator("#modalTitle").innerText(),
                await card.locator("h3").innerText(),
              );
              assert.equal(
                await page.locator(".package-details__features li").count(),
                await card.locator(".pricing-card__features li").count(),
              );
              await page.keyboard.press("Escape");
              assert.equal(await page.locator("#modalOverlay").getAttribute("aria-hidden"), "true");
              assert.ok(await card.locator(".pricing-card__feature-extra[hidden]").count());
            }
          }
          if (route === "academy/") {
            assert.equal(await page.locator(".academy-page > .academy-faq-section").count(), 1);
            assert.equal(await page.locator(".academy-youtube-section .faq-section").count(), 0);
            assert.equal(await page.locator(".academy-compare-scroll").count(), 0);
            assert.equal(
              await page.locator(".academy-table-section, .academy-decision-grid").count(),
              0,
            );
            assert.equal(await page.locator("[data-academy-details]").count(), 2);
            assert.equal(
              await page
                .locator(".academy-comparison")
                .evaluate((element) => element.scrollWidth <= element.clientWidth),
              true,
            );
            for (const button of await page.locator("[data-academy-details]").all()) {
              if (width < 768) {
                const key = await button.getAttribute("data-academy-details");
                await page.locator(`[data-academy-tab='${key}']`).click();
              }
              await button.click();
              assert.equal(
                await page.locator("#modalOverlay").getAttribute("aria-hidden"),
                "false",
              );
              assert.equal(
                await page.locator("#modalTitle").innerText(),
                await button.locator("xpath=..").locator("h3").innerText(),
              );
              assert.equal(await page.locator(".academy-details__list > div").count(), 18);
              assert.equal(
                await page
                  .locator("#modalDialog")
                  .evaluate((element) => element.scrollWidth <= element.clientWidth),
                true,
              );
              await page.keyboard.press("Escape");
              assert.equal(
                await button.evaluate((element) => document.activeElement === element),
                true,
              );
            }
            if (width < 768) {
              const tab = page.locator("[data-academy-tab='private']");
              await tab.focus();
              await tab.press("ArrowRight");
              assert.equal(
                await page.locator("[data-academy-tab='group']").getAttribute("aria-selected"),
                "true",
              );
              assert.equal(await page.locator("[data-academy-plan='group']").isVisible(), true);
              await page.locator("[data-academy-tab='group']").press("Home");
              assert.equal(await tab.getAttribute("aria-selected"), "true");
            }
          }
          if (route === "resume/") {
            const filter = page.locator("#projectFilterSelect");
            const values = await filter
              .locator("option")
              .evaluateAll((items) => items.map((option) => option.value));
            if (values.length > 1) {
              await filter.selectOption(values[1]);
              await filter.selectOption("all");
            }
            const details = page.locator("[data-action='open-details']").first();
            await details.click();
            assert.equal(await page.locator("#modalOverlay").getAttribute("aria-hidden"), "false");
            await page.keyboard.press("Escape");
            assert.equal(await page.locator("#modalOverlay").getAttribute("aria-hidden"), "true");
          }

          // Audit both themes and languages at desktop and phone sizes.
          if ([360, 1440].includes(width) && route !== "resume/") {
            await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
            const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
            const violations = audit.violations.map((issue) => ({
              id: issue.id,
              nodes: issue.nodes.map((node) => ({
                target: node.target,
                summary: node.failureSummary,
              })),
            }));
            report.push({ label, violations });
            assert.deepEqual(violations, [], `Accessibility: ${label}`);
            await page.screenshot({
              path: fileURLToPath(
                new URL(
                  `ui-${route.replace("/", "") || "home"}-${width}-${locale}-${theme}.png`,
                  output,
                ),
              ),
            });
          }
        }
        if (width < 768) {
          const menu = page.locator("#mobileMenuBtn");
          await menu.click();
          assert.equal(await menu.getAttribute("aria-expanded"), "true");
          await page.keyboard.press("Escape");
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
          await menu.click();
          await page.locator("#mNavHomePage").click();
          await page.locator("#homePage:not(.hidden)").waitFor();
          assert.equal(await page.locator("#homePage").isVisible(), true);
          assert.equal(await menu.getAttribute("aria-expanded"), "false");
        }
        assert.deepEqual(errors, []);
        console.log(`PASS ${width}px ${locale} ${theme}: 5 pages, controls and assets`);
        await context.close();
      }
    }
  }
} finally {
  await writeFile(new URL("ui-audit.json", output), JSON.stringify(report, null, 2));
  await browser.close();
}
