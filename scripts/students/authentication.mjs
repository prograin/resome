import assert from "node:assert/strict";
import { studentPaths } from "../../src/lib/student-auth/paths.js";

export async function checkAuthentication({
  page,
  context,
  origin,
  login,
  dashboard,
  courses,
  profile,
  password,
  submit,
}) {
  await page.goto(courses);
  await page.waitForURL(login);
  await page.goto(profile);
  await page.waitForURL(login);
  await page.goto(origin + studentPaths.history);
  await page.waitForURL(login);
  assert.match(await page.locator('meta[name="robots"]').getAttribute("content"), /noindex/);
  assert.equal(
    (await page.request.post(origin + "/api/auth/sign-up/email/", { data: {} })).status(),
    404,
  );

  await submit("incorrect-password");
  const alert = page.locator('.student-panel [role="alert"]');
  await alert.waitFor({ timeout: 7000 });
  assert.match(await alert.innerText(), /درست نیست/);
  const username = page.locator('[name="username"]');
  assert.equal(await username.getAttribute("aria-invalid"), "true");
  assert.equal(await username.getAttribute("aria-describedby"), await alert.getAttribute("id"));

  const signedIn = page.waitForResponse(
    (response) =>
      response.request().method() === "POST" &&
      /\/api\/auth\/sign-in\/username\/?$/.test(response.url()) &&
      response.status() !== 308,
  );
  await submit(password);
  const signInResponse = await signedIn;
  assert.equal(signInResponse.status(), 200, "Username and password sign-in succeeds");
  await page.waitForURL(dashboard, { timeout: 7000, waitUntil: "domcontentloaded" });
  const dashboardTitle = page.getByRole("heading", { name: "داشبورد", exact: true });
  await dashboardTitle.waitFor();
  assert.ok(
    (await context.cookies()).some(
      (cookie) => cookie.name.includes("session_token") && cookie.httpOnly,
    ),
  );
  const dashboardResponse = await page.reload();
  assert.match(dashboardResponse.headers()["cache-control"], /private|no-store/);
  await dashboardTitle.waitFor();
  await page.goto(login);
  await page.waitForURL(dashboard);
}
