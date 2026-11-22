import assert from "node:assert/strict";
import { studentAuthPolicy } from "../../src/lib/student-auth/config.js";
import { studentCopy } from "../../src/features/students/content.js";
import { createStudentContext } from "../lib/student-browser-context.mjs";

export async function checkLogoutFailure({ browser, context: originalContext, origin, profile }) {
  const context = await createStudentContext(browser, {
    storageState: await originalContext.storageState(),
  });
  const pattern = /\/api\/auth\/sign-out\/?$/;
  let held;
  try {
    const page = await context.newPage();
    await page.clock.install();
    await page.goto(profile);
    const form = page.locator("form.student-profile__actions");
    const alert = form.getByRole("alert");
    const endpoint = origin + "/api/auth/get-session/";
    const current = await (await page.request.get(endpoint)).json();
    let started;
    const intercepted = new Promise((resolve) => {
      started = resolve;
    });
    await page.route(pattern, (route) => {
      held = route;
      started();
    });
    const button = page.getByRole("button", { name: studentCopy.fa.signOut, exact: true });
    await button.click();
    await intercepted;
    await page.locator('.student-profile__actions[aria-busy="true"]').waitFor();
    await page.clock.fastForward(studentAuthPolicy.requestTimeout + 100);
    await alert.getByText(studentCopy.fa.signOutFailed, { exact: true }).waitFor();
    await page.locator("form.student-profile__actions button:not(:disabled)").waitFor();
    assert.equal(page.url(), profile);
    assert.equal((await (await page.request.get(endpoint)).json()).session.id, current.session.id);
    await held.abort().catch(() => {});
    held = null;
    await page.unroute(pattern);
    await page.route(pattern, (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({ message: "Unavailable" }),
      }),
    );
    const failed = page.waitForResponse(
      (response) => pattern.test(response.url()) && response.status() === 503,
    );
    await button.click();
    await failed;
    await page.locator("form.student-profile__actions button:not(:disabled)").waitFor();
    assert.equal(await alert.innerText(), studentCopy.fa.signOutFailed);
    assert.equal(page.url(), profile);
    assert.equal((await (await page.request.get(endpoint)).json()).session.id, current.session.id);
  } finally {
    await held?.abort().catch(() => {});
    await context.close();
  }
}
