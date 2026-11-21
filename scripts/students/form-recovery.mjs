import assert from "node:assert/strict";

export async function checkFormRecovery(page, form, submit, status, mode = "offline") {
  const values = () =>
    form
      .locator("input, textarea, select")
      .evaluateAll((fields) => fields.map(({ name, value }) => [name, value]));
  const before = await values();
  let requests = 0;
  const intercept = (route) => {
    const request = route.request();
    if (request.method() !== "POST" || !request.headers()["next-action"]) return route.continue();
    requests++;
    return mode === "offline"
      ? route.abort("internetdisconnected")
      : route.fulfill({ status: 503, contentType: "text/plain", body: "Unavailable" });
  };
  await page.route("**/*", intercept);
  try {
    await submit.click();
    await form.locator(`[data-status="${status}"][role="alert"]`).waitFor();
    await page.waitForFunction((button) => !button.disabled, await submit.elementHandle());
    assert.deepEqual(await values(), before, "A failed submission must preserve form values");
    assert.equal(requests, 1, "Do not retry a mutation automatically");
  } finally {
    await page.unroute("**/*", intercept);
  }
}
