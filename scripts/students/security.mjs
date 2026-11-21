import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";

export async function checkSecurity({ page, origin, profile, username }) {
  const home = await page.request.get(origin + "/");
  assert.equal(home.headers()["x-content-type-options"], "nosniff");
  assert.equal(home.headers()["x-frame-options"], "DENY");
  assert.match(home.headers()["content-security-policy"], /frame-ancestors 'none'/);
  assert.ok(!home.headers()["content-security-policy"].includes("unsafe-eval"));
  const privatePage = await page.request.get(profile);
  const policy = privatePage.headers()["content-security-policy"];
  assert.match(policy, /script-src[^;]*'nonce-/);
  assert.ok(
    !policy
      .split(";")
      .find((directive) => directive.includes("script-src"))
      .includes("unsafe-inline"),
  );
  const repeated = await page.request.get(profile);
  assert.notEqual(repeated.headers()["content-security-policy"], policy);
  const session = await page.request.get(origin + "/api/auth/get-session/");
  assert.match(session.headers()["cache-control"], /no-store/);
  const user = (await session.json()).user.id;
  const csrf = await page.request.post(origin + "/api/auth/sign-out/", {
    headers: { Origin: "https://evil.example" },
    data: {},
  });
  assert.equal(csrf.status(), 403);
  assert.equal(
    (await (await page.request.get(origin + "/api/auth/get-session/")).json()).user.id,
    user,
  );
  for (const endpoint of ["sign-up/email", "update-user", "change-email", "delete-user"]) {
    const response = await page.request.post(`${origin}/api/auth/${endpoint}/`, { data: {} });
    assert.equal(response.status(), 404);
  }
  const target = "missing_" + randomBytes(4).toString("hex");
  for (let index = 0; index < 21; index++) {
    const attempt = await page.request.post(origin + "/api/auth/sign-in/username/", {
      headers: { Origin: origin, "X-Forwarded-For": `192.0.2.${index + 1}` },
      data: { username: target, password: "incorrect-password" },
    });
    assert.equal(attempt.status(), index < 20 ? 401 : 429);
    if (index === 20) assert.ok(Number(attempt.headers()["retry-after"]) > 0);
  }
  assert.equal((await page.request.get(origin + "/api/cron/student-weekly/")).status(), 401);
  assert.equal(
    (
      await page.request.post(origin + "/api/auth/sign-in/username/", {
        data: "{",
        headers: { "Content-Type": "application/json", Origin: origin },
      })
    ).status(),
    400,
  );
  assert.equal(
    (
      await page.request.post(origin + "/api/auth/sign-in/username/", {
        data: "x".repeat(9000),
        headers: { "Content-Type": "application/json", Origin: origin },
      })
    ).status(),
    413,
  );
  await page.goto(profile);
  await page.evaluate(() => {
    window.securityProbe = false;
    const button = document.createElement("button");
    button.id = "security-probe";
    button.type = "button";
    button.textContent = "Security probe";
    button.setAttribute("onclick", "window.securityProbe = true");
    Object.assign(button.style, {
      position: "fixed",
      top: "100px",
      left: "10px",
      zIndex: "2147483647",
    });
    document.body.append(button);
  });
  await page.locator("#security-probe").click({ noWaitAfter: true });
  assert.equal(
    await page.evaluate(() => window.securityProbe),
    false,
    "CSP blocks injected inline event handlers",
  );
  await page.locator("#security-probe").evaluate((button) => button.remove());
  const details = page.getByRole("form", { name: "اطلاعات فردی" });
  await details.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  await details.locator('[name="username"]').fill(username);
  let actionRequest;
  for (let index = 0; index < 9; index++) {
    const [response] = await Promise.all([
      page.waitForResponse((response) => response.request().method() === "POST"),
      details.getByRole("button", { name: "ذخیرهٔ تغییرات" }).click(),
    ]);
    actionRequest = response.request();
    await page
      .locator('.student-profile__form button[type="submit"]:disabled')
      .waitFor({ state: "hidden" });
  }
  await details.getByRole("alert").waitFor();
  assert.match(await details.getByRole("alert").innerText(), /یک دقیقه/);
  const actionId = actionRequest.headers()["next-action"];
  assert.ok(actionId);
  const original = new Request(profile, {
    method: "POST",
    headers: { "Content-Type": actionRequest.headers()["content-type"] },
    body: actionRequest.postDataBuffer(),
  });
  const payload = await original.formData();
  payload.set("padding", "x".repeat(70_000));
  const encoded = new Request(profile, { method: "POST", body: payload });
  const oversized = await page.request.post(profile, {
    headers: {
      Origin: origin,
      "Next-Action": actionId,
      "Content-Type": encoded.headers.get("content-type"),
    },
    data: Buffer.from(await encoded.arrayBuffer()),
  });
  // Next can wrap the 413 as a Server Actions 500 response; a valid action would return 200.
  assert.ok([413, 500].includes(oversized.status()));
  assert.ok(!(await oversized.text()).includes("x".repeat(128)));
}
