import assert from "node:assert/strict";

export async function checkSession({ page, context, dashboard, login, origin, signOut }) {
  const previousCookies = (await context.cookies(origin))
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  const second = await context.newPage();
  try {
    await second.goto(dashboard);
    await second.locator(".student-dashboard__main").waitFor();
    await signOut();
    const revoked = await page.request.get(origin + "/api/auth/get-session/", {
      headers: { Cookie: previousCookies },
    });
    assert.equal(
      await revoked.json(),
      null,
      "Signing out revokes the previous session in the database",
    );
    await second.bringToFront();
    await second.waitForURL(login);
    assert.equal(await second.locator(".student-dashboard__main").count(), 0);
    const statuses = [];
    for (let index = 0; index < 4; index += 1) {
      const response = await page.request.post(origin + "/api/auth/sign-in/username/", {
        headers: { Origin: origin },
        data: { username: "missing_student", password: "incorrect-password" },
      });
      statuses.push(response.status());
    }
    assert.ok(statuses.includes(429), "Better Auth rate limits repeated sign-in attempts");
  } finally {
    await second.close();
  }
}
