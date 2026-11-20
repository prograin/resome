import assert from "node:assert/strict";
import AxeBuilder from "@axe-core/playwright";
import { eq } from "drizzle-orm";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { users } from "../../src/lib/db/schema/auth.js";
import { studentLinksCopy } from "../../src/features/students/student-links-copy.js";
import { profileCopy } from "../../src/features/students/profile-copy.js";
import { checkAcademyDepth } from "../lib/academy-depth.mjs";

export async function checkStudentLinks(fixture, db) {
  const { origin, browser, username, password, admin, studentId } = fixture;
  const path = origin + studentPaths.links;
  const page = fixture.page;
  await page.goto(path);
  await page.waitForURL(origin + studentPaths.signIn);
  await db
    .update(users)
    .set({ github: "Octocat", telegram: "https://t.me/learner_test" })
    .where(eq(users.id, studentId));
  const response = await fixture.context.request.post(origin + "/api/auth/sign-in/username/", {
    headers: { Origin: origin },
    data: { username, password },
  });
  assert.equal(response.status(), 200);
  await page.goto(path);
  const storageState = await fixture.context.storageState();
  for (const locale of ["fa", "en"])
    for (const theme of ["dark", "light"]) {
      const context = await browser.newContext({
        storageState,
        viewport: { width: 360, height: 960 },
      });
      await context.addInitScript(
        ({ locale, theme }) => {
          localStorage.setItem("portfolio_locale", locale);
          localStorage.setItem("portfolio_theme", theme);
        },
        { locale, theme },
      );
      const view = await context.newPage();
      await view.goto(path);
      await view
        .getByRole("heading", { name: studentLinksCopy[locale].title, exact: true })
        .waitFor();
      assert.match(await view.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
      const cards = view.locator(".student-links__grid:visible .student-links__card");
      assert.equal(await cards.count(), 2);
      assert.ok(!(await cards.allTextContents()).some((text) => text.includes(admin)));
      assert.equal(
        await view
          .locator(
            `.student-dashboard:visible .student-sidebar a[href="${studentPaths.links}"][aria-current="page"]`,
          )
          .count(),
        1,
      );
      const own = cards.filter({ has: view.getByRole("heading", { name: username, exact: true }) });
      const link = own.getByRole("link", {
        name: `${profileCopy[locale].github} · ${username}`,
        exact: true,
      });
      assert.equal(await link.getAttribute("href"), "https://github.com/octocat");
      assert.equal(await link.getAttribute("target"), "_blank");
      assert.match(await link.getAttribute("rel"), /noopener/);
      assert.equal(await own.locator('a[href="https://t.me/learner_test"]').count(), 1);
      for (const width of [360, 768, 1440]) {
        await view.setViewportSize({ width, height: 960 });
        assert.ok(await view.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        assert.equal(
          await view
            .locator(".student-links__grid:visible")
            .evaluate((el) => getComputedStyle(el).display),
          "grid",
        );
        await checkAcademyDepth(view);
        const accessibility = await new AxeBuilder({ page: view }).analyze();
        assert.deepEqual(
          accessibility.violations.map((v) => v.id),
          [],
        );
        await view.screenshot({ path: `.backup/qa/student-links-${locale}-${theme}-${width}.png` });
      }
      await view.getByRole("link", { name: studentLinksCopy[locale].edit, exact: true }).click();
      await view.waitForURL(origin + studentPaths.profile);
      const form = view.getByRole("form", { name: profileCopy[locale].details, exact: true });
      assert.equal(
        await form.locator('[name="github"]').inputValue(),
        "https://github.com/octocat",
      );
      for (const name of ["telegram", "linkedin", "website"])
        assert.equal(await form.locator(`[name="${name}"]`).isDisabled(), true);
      await form
        .getByRole("button", {
          name: `${profileCopy[locale].edit} ${profileCopy[locale].details}`,
          exact: true,
        })
        .click();
      for (const name of ["telegram", "linkedin", "website"])
        assert.equal(await form.locator(`[name="${name}"]`).isDisabled(), false);
      await context.close();
    }
  const teacher = await browser.newContext();
  try {
    const login = await teacher.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin },
      data: { username: admin, password },
    });
    assert.equal(login.status(), 200);
    const adminPage = await teacher.newPage();
    await adminPage.goto(path);
    await adminPage.locator(".student-links__grid").waitFor();
    assert.equal(await adminPage.locator("#student-dashboard-nav a").count(), 5);
    assert.equal(
      await adminPage.locator(`a[href="${studentPaths.links}"][aria-current="page"]`).count(),
      1,
    );
  } finally {
    await teacher.close();
  }
  console.log(
    "PASS student links: authentication, private metadata, student/admin navigation, existing profiles, responsive grid, themes, accessibility and edit controls.",
  );
}
