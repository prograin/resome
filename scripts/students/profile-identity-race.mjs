import assert from "node:assert/strict";
import { setTimeout as delay } from "node:timers/promises";
import { eq, sql } from "drizzle-orm";
import { users } from "../../src/lib/db/schema/index.js";

export async function checkProfileIdentityRace(fixture, database) {
  const { page, origin, username, password, studentId } = fixture;
  await database.db
    .update(users)
    .set({ name: "Original Student", firstName: "Original", lastName: "Student" })
    .where(eq(users.id, studentId));
  const login = await page.request.post(origin + "/api/auth/sign-in/username/", {
    headers: { Origin: origin },
    data: { username, password },
  });
  assert.equal(login.status(), 200);
  await page.goto(fixture.profile);
  const form = page.getByRole("form", { name: "اطلاعات فردی" });
  await form.getByRole("button", { name: "ویرایش اطلاعات فردی", exact: true }).click();
  await form.locator('[name="github"]').fill("https://github.com/octocat");
  const capture = page.waitForRequest(
    (request) => request.method() === "POST" && Boolean(request.headers()["next-action"]),
  );
  await form.locator('button[type="submit"]').click();
  const request = await capture;
  await form.locator('[name="username"][readonly]').waitFor();
  const lock = await database.pool.connect();
  let pending;
  try {
    await lock.query("BEGIN");
    // Pause the profile request after its session read, before its update.
    await lock.query("LOCK TABLE student_mutation_limit IN ACCESS EXCLUSIVE MODE");
    pending = page.request.post(request.url(), {
      headers: {
        Origin: origin,
        "next-action": request.headers()["next-action"],
        "content-type": request.headers()["content-type"],
      },
      data: request.postDataBuffer(),
    });
    let waiting = false;
    for (let attempt = 0; attempt < 50; attempt++) {
      const result = await database.db.execute(
        sql`select count(*)::int as total from pg_stat_activity where datname=current_database() and wait_event_type='Lock' and query ilike '%student_mutation_limit%'`,
      );
      if (result.rows[0].total > 0) {
        waiting = true;
        break;
      }
      await delay(100);
    }
    assert.ok(waiting, "Profile request reached the controlled concurrency boundary");
    await database.db
      .update(users)
      .set({ name: "New Teachername", firstName: "New", lastName: "Teachername" })
      .where(eq(users.id, studentId));
    await lock.query("COMMIT");
  } finally {
    await lock.query("ROLLBACK");
    lock.release();
    await pending;
  }
  assert.equal((await pending).status(), 200);
  const [user] = await database.db.select().from(users).where(eq(users.id, studentId));
  assert.equal(user.firstName, "New");
  assert.equal(user.lastName, "Teachername");
  assert.equal(user.name, "New Teachername");
  assert.equal(user.github, "https://github.com/octocat");
  console.log("PASS concurrent profile save preserves the admin's identity update");
}
