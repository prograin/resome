import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createPreferenceContext } from "./lib/browser-preferences.mjs";
import { seedWeeklyChanges } from "./students/weekly-fixture.mjs";
import { checkAcademyDepth } from "./lib/academy-depth.mjs";
import { weeklyStats } from "../src/lib/db/schema/index.js";

const database = await createTestDatabase("weekly_ui");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  await seedWeeklyChanges(database.db, fixture);
  const login = await fixture.context.request.post(fixture.origin + "/api/auth/sign-in/username/", {
    headers: { Origin: fixture.origin },
    data: { username: fixture.username, password: fixture.password },
  });
  assert.equal(login.status(), 200);
  const storageState = await fixture.context.storageState();
  for (const locale of ["fa", "en"])
    for (const theme of ["light", "dark"]) {
      const context = await createPreferenceContext(fixture.browser, {
        locale,
        theme,
        storageState,
        viewport: { width: 360, height: 960 },
        reducedMotion: "reduce",
      });
      try {
        const page = await context.newPage();
        for (const width of [360, 1440]) {
          await page.setViewportSize({ width, height: 960 });
          await page.goto(fixture.dashboard);
          await page.waitForLoadState("networkidle");
          await page.locator(".student-chart__average:visible").first().waitFor();
          await page.evaluate(() => document.fonts.ready);
          const metrics = page.locator(".student-chart__average:visible");
          assert.deepEqual(
            await metrics.evaluateAll((cards) => cards.map((card) => card.dataset.weeklyTrend)),
            ["positive", "negative", "neutral", "positive"],
          );
          const failures = await metrics.evaluateAll((cards) =>
            cards.flatMap((card) => {
              const icon = card.querySelector(".student-chart__trend");
              const box = card.getBoundingClientRect(),
                indicator = icon.getBoundingClientRect();
              const layer = getComputedStyle(card, "::before");
              const issue = [];
              const description = card.querySelector(
                ".student-weekly-change:not(.student-chart__trend) > span:not([aria-hidden])",
              );
              if (
                !description ||
                description.getBoundingClientRect().width > 1 ||
                getComputedStyle(description).position !== "absolute"
              )
                issue.push("accessible description must not duplicate the visible text");
              if (Math.abs(indicator.x - box.x - 12) > 1)
                issue.push("indicator must stay on the physical left");
              if (
                !/90deg|to right/.test(layer.backgroundImage) ||
                !layer.boxShadow.includes("inset")
              )
                issue.push("missing left gradient or inset glow");
              for (const child of [...card.children].filter((node) => node !== icon)) {
                if (child.getBoundingClientRect().left < indicator.right)
                  issue.push("indicator overlaps content");
              }
              return issue;
            }),
          );
          assert.deepEqual(failures, [], `${locale} ${theme} ${width}`);
          await checkAcademyDepth(page);
          const overflow = await page.evaluate(() => ({
            width: innerWidth,
            scroll: document.documentElement.scrollWidth,
            nodes: [...document.querySelectorAll("main *")]
              .filter((node) => {
                const box = node.getBoundingClientRect();
                return box.width && (box.right > innerWidth + 1 || box.left < -1);
              })
              .map((node) => ({
                tag: node.tagName,
                className: node.getAttribute("class"),
                x: node.getBoundingClientRect().x,
                width: node.getBoundingClientRect().width,
              }))
              .slice(0, 12),
          }));
          assert.ok(
            overflow.scroll <= overflow.width,
            `${locale} ${theme} ${width}: ${JSON.stringify(overflow)}`,
          );
          const changes = page.locator(".student-weekly-change--compact:visible");
          const expected = locale === "fa" ? ["۲", "۰", "۲", "—"] : ["2", "0", "2", "—"];
          assert.deepEqual(
            await changes.locator('span[aria-hidden="true"]').allTextContents(),
            expected,
          );
          assert.deepEqual(
            await changes
              .locator("svg")
              .evaluateAll((nodes) => nodes.map((node) => node.dataset.lucide)),
            ["trending-up", "move-horizontal", "trending-down", "move-horizontal"],
          );
          assert.equal(
            await changes.first().evaluate((node) => getComputedStyle(node).whiteSpace),
            "nowrap",
          );
          const leaders = page.locator(".student-weekly-leaders");
          const courseTab = leaders.getByRole("tab", {
            name: locale === "fa" ? "دورهٔ فعلی" : "Current course",
            exact: true,
          });
          await courseTab.click();
          assert.equal(await courseTab.getAttribute("aria-selected"), "true");
          assert.equal(await leaders.getByRole("tabpanel").count(), 1);
          assert.equal(await leaders.locator("tbody tr:visible").count(), 4);
          await leaders
            .getByRole("tab", {
              name: locale === "fa" ? "۱۰ نفر برتر کلی" : "Overall top 10",
              exact: true,
            })
            .click();
          assert.equal(await courseTab.getAttribute("aria-selected"), "false");
          const audit = await new AxeBuilder({ page })
            .include("main")
            .withTags(["wcag2a", "wcag2aa"])
            .analyze();
          assert.deepEqual(
            audit.violations.map((issue) => ({
              id: issue.id,
              targets: issue.nodes.map((node) => node.target),
            })),
            [],
            `${locale} ${theme} ${width}`,
          );
        }
      } finally {
        await context.close();
      }
    }
  await database.db.delete(weeklyStats);
  await fixture.page.goto(fixture.dashboard);
  assert.deepEqual(
    await fixture.page
      .locator(".student-chart__average")
      .evaluateAll((cards) => cards.map((card) => card.dataset.weeklyTrend)),
    ["neutral", "neutral", "neutral", "neutral"],
  );
  assert.deepEqual(
    await fixture.page
      .locator(
        '.student-chart__average > .student-weekly-change:not(.student-chart__trend) > span[aria-hidden="true"]',
      )
      .allTextContents(),
    ["—", "—", "—", "—"],
  );
  console.log(
    "PASS weekly UI: positive/negative/zero/missing comparisons, fixed-left KPI indicators, gradients, inset depth, compact localized ranking changes, both themes/directions/sizes and accessibility.",
  );
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
