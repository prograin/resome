import assert from "node:assert/strict";
import { eq } from "drizzle-orm";
import { createDatabase } from "../../src/lib/db/client.js";
import { sessions } from "../../src/lib/db/schema/auth.js";

export async function checkSessionRenewal({ page, context, origin, profile }) {
  await page.goto(origin + "/academy/");
  const endpoint = origin + "/api/auth/get-session/";
  const current = await (await page.request.get(endpoint)).json();
  const originalCookie = (await context.cookies(origin)).find((cookie) =>
    cookie.name.includes("session_token"),
  );
  const earlier = new Date(Date.now() + 2 * 86_400_000);
  await context.addCookies([{ ...originalCookie, expires: Math.floor(earlier.getTime() / 1000) }]);
  const { db, pool } = createDatabase(process.env.STUDENT_TEST_DATABASE_URL);
  const readExpiry = async () =>
    (
      await db
        .select({ expires: sessions.expiresAt })
        .from(sessions)
        .where(eq(sessions.id, current.session.id))
    )[0].expires.getTime();
  try {
    await db
      .update(sessions)
      .set({ expiresAt: earlier, updatedAt: new Date(Date.now() - 5 * 86_400_000) })
      .where(eq(sessions.id, current.session.id));
    const document = await page.request.get(profile);
    assert.equal(document.status(), 200);
    assert.equal(
      await readExpiry(),
      earlier.getTime(),
      "Rendering the page cannot renew only the database session",
    );
    const read = await page.request.get(endpoint);
    assert.equal((await read.json()).needsRefresh, true);
    assert.equal(await readExpiry(), earlier.getTime(), "GET must not extend the session");
    const denied = await page.request.post(endpoint, {
      headers: { Origin: "https://evil.example" },
      data: {},
    });
    assert.equal(denied.status(), 403);
    assert.equal(await readExpiry(), earlier.getTime());
    const refreshed = await page.request.post(endpoint, { headers: { Origin: origin }, data: {} });
    assert.equal(refreshed.status(), 200);
    const renewed = await refreshed.json();
    const updatedCookie = (await context.cookies(origin)).find(
      (cookie) => cookie.name === originalCookie.name,
    );
    assert.equal(renewed.session.id, current.session.id);
    assert.ok((await readExpiry()) > earlier.getTime() + 4 * 86_400_000);
    assert.ok(updatedCookie.expires > earlier.getTime() / 1000 + 4 * 86_400);
    assert.ok(Math.abs(updatedCookie.expires * 1000 - (await readExpiry())) < 2000);

    await db
      .update(sessions)
      .set({ expiresAt: earlier })
      .where(eq(sessions.id, current.session.id));
    await context.addCookies([{ ...updatedCookie, expires: Math.floor(earlier.getTime() / 1000) }]);
    await page.goto(profile);
    await page.waitForFunction(() => document.querySelector(".student-dashboard__main"));
    await page.waitForLoadState("networkidle");
    assert.ok(
      (await readExpiry()) > earlier.getTime() + 4 * 86_400_000,
      "Better Auth's client automatically performs the renewal POST",
    );
  } finally {
    await pool.end();
  }
}
