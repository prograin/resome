import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { studentPaths } from "../../src/lib/student-auth/paths.js";
import { createStudentContext } from "../lib/student-browser-context.mjs";

export async function checkAccountBoundaries({
  browser,
  origin,
  login,
  dashboard,
  profile,
  username,
  other,
  password,
  otherId,
  studentId,
}) {
  const context = await createStudentContext(browser, { viewport: { width: 390, height: 850 } });
  try {
    const first = await context.newPage();
    const second = await context.newPage();
    await first.goto(login);
    await second.goto(login);
    const signIn = async (page, account) => {
      await page.locator('[name="username"]').fill(account);
      await page.locator('[name="password"]').fill(password);
      await page.locator('.student-panel button[type="submit"]').click();
      await page.waitForURL(dashboard);
      await page.locator(".student-dashboard__main").waitFor();
    };
    const focusSession = async (id) => {
      await delay(5100);
      const fetched = first.waitForResponse(
        async (response) =>
          response.url().includes("/api/auth/get-session") &&
          response.status() === 200 &&
          (await response.json())?.user?.id === id,
      );
      await first.bringToFront();
      await first.evaluate(() => document.dispatchEvent(new Event("visibilitychange")));
      await fetched;
    };
    await signIn(first, username);
    await first.goto(profile);
    assert.equal(await first.locator('[name="username"]').inputValue(), username);
    await signIn(second, other);
    await focusSession(otherId);
    await first.waitForFunction(
      (expected) => document.querySelector('[name="username"]')?.value === expected,
      other,
    );
    assert.equal(await first.locator('[name="email"]').inputValue(), "");

    await first.goto(origin + studentPaths.goals);
    await first.locator('.student-progress__header button[aria-haspopup="dialog"]').click();
    await first.getByRole("dialog").waitFor();
    assert.equal(
      (
        await second.request.post(origin + "/api/auth/sign-in/username/", {
          headers: { Origin: origin },
          data: { username, password },
        })
      ).status(),
      200,
    );
    await focusSession(studentId);
    await first.getByRole("dialog").waitFor({ state: "hidden" });

    await first.goto(origin + "/academy/");
    await first.evaluate(() => {
      window.boundaryProbe = true;
    });
    const privateNavigation = first.waitForResponse(
      (response) =>
        response.request().isNavigationRequest() &&
        response.url().startsWith(origin + studentPaths.dashboard),
    );
    await first.locator(".academy-hero__students").click();
    await first.waitForURL(dashboard);
    assert.match((await privateNavigation).headers()["content-security-policy"], /'nonce-/);
    assert.equal(await first.evaluate(() => window.boundaryProbe), undefined);
    await first.evaluate(() => {
      window.boundaryProbe = true;
    });
    await first.locator('.student-shell__footer:visible nav a[href="/academy/"]').click();
    await first.waitForURL(origin + "/academy/");
    assert.equal(await first.evaluate(() => window.boundaryProbe), undefined);
  } finally {
    await context.close();
  }
  await delay(10_100);
}
