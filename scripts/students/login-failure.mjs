import assert from "node:assert/strict";
import { studentAuthPolicy } from "../../src/lib/student-auth/config.js";
import { studentCopy } from "../../src/features/students/content.js";
import { createStudentContext } from "../lib/student-browser-context.mjs";

export async function checkLoginFailure({ browser, login, username, password }) {
  const context = await createStudentContext(browser);
  let held;
  const pattern = /\/api\/auth\/sign-in\/username\/?$/;
  try {
    const page = await context.newPage();
    await page.clock.install();
    await page.goto(login);
    let started;
    const intercepted = new Promise((resolve) => {
      started = resolve;
    });
    let attempts = 0;
    await page.route(pattern, (route) => {
      attempts++;
      held = route;
      started();
    });
    await page.locator('[name="username"]').fill(username);
    await page.locator('[name="password"]').fill(password);
    await page.locator('.student-panel button[type="submit"]').click();
    await intercepted;
    await page.locator(".student-panel fieldset[disabled]").waitFor();
    await page.clock.fastForward(studentAuthPolicy.requestTimeout + 100);
    await page
      .locator('.student-panel [role="alert"]')
      .getByText(studentCopy.fa.unavailable, { exact: true })
      .waitFor();
    await page.locator('.student-panel button[type="submit"]:not(:disabled)').waitFor();
    assert.equal(await page.locator('[name="username"]').inputValue(), username);
    await page.waitForFunction(() => document.querySelector('[name="password"]').value === "");
    assert.equal(attempts, 1, "A timed-out sign-in must not be submitted automatically again");
    assert.equal(new URL(page.url()).pathname, new URL(login).pathname);
    await held.abort().catch(() => {});
    held = null;
    await page.unroute(pattern);
    for (const status of [408, 503]) {
      await page.route(pattern, (route) =>
        route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify({ message: "Temporarily unavailable" }),
        }),
      );
      const response = page.waitForResponse(
        (response) => pattern.test(response.url()) && response.status() === status,
      );
      await page.locator('[name="password"]').fill(password);
      await page.locator('.student-panel button[type="submit"]').click();
      await response;
      await page.locator('.student-panel button[type="submit"]:not(:disabled)').waitFor();
      assert.equal(
        await page.locator('.student-panel [role="alert"]').innerText(),
        studentCopy.fa.unavailable,
      );
      assert.equal(await page.locator('[name="username"]').inputValue(), username);
      await page.unroute(pattern);
    }
  } finally {
    await held?.abort().catch(() => {});
    await context.close();
  }
}
