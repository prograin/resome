import assert from "node:assert/strict";
import { sql } from "drizzle-orm";
import { createTestDatabase } from "./lib/test-database.mjs";
import { createStudentFixture } from "./students/fixture.mjs";
import { createMutationLimits } from "../src/lib/security/mutation-limit.js";
import { requestLimitKey } from "../src/lib/security/request-limit.js";
import { mutationLimits } from "../src/lib/db/schema/security.js";

const database = await createTestDatabase("backend_guards");
let fixture;
try {
  process.env.STUDENT_TEST_DATABASE_URL = database.url;
  fixture = await createStudentFixture();
  const { origin, page, context, username, password, studentId } = fixture;
  const api = page.request;
  const auth = origin + "/api/auth/";
  const notifications = origin + "/api/students/notifications/";
  const headers = { Origin: origin };
  const login = await api.post(auth + "sign-in/username/", {
    headers,
    data: { username, password },
  });
  assert.equal(login.status(), 200);
  for (const supplied of [undefined, "null", "https://evil.example"]) {
    const response = await api.post(auth + "sign-out/", {
      headers: supplied ? { Origin: supplied } : {},
      data: {},
    });
    assert.equal(response.status(), 403);
  }
  assert.equal((await (await api.get(auth + "get-session/")).json()).user.id, studentId);
  for (const query of ["disableRefresh=true&disableRefresh=false", "role=admin"]) {
    assert.equal((await api.get(auth + "get-session/?" + query)).status(), 400);
  }
  assert.equal((await api.get(auth + "get-session/?disableRefresh=true")).status(), 200);
  for (const query of ["before=1&before=2", "before=-1", "admin=true"]) {
    assert.equal((await api.get(notifications + "?" + query)).status(), 400);
  }
  assert.equal(
    (await api.patch(notifications, { headers, data: { through: 1, studentId } })).status(),
    400,
  );
  assert.equal(
    (
      await api.patch(notifications, {
        headers: { Origin: "https://evil.example" },
        data: { through: 1 },
      })
    ).status(),
    403,
  );
  assert.equal(
    (
      await api.patch(notifications, {
        headers: { ...headers, "Content-Type": "application/json" },
        data: "x".repeat(9000),
      })
    ).status(),
    413,
  );

  const ip = "192.0.2.90";
  const malformed = (address) =>
    api.post(auth + "sign-in/username/", {
      headers: { ...headers, "Content-Type": "application/json", "X-Forwarded-For": address },
      data: "{",
    });
  for (let index = 0; index < 30; index++) assert.equal((await malformed(ip)).status(), 400);
  const limited = await malformed(ip);
  assert.equal(limited.status(), 429);
  assert.ok(Number(limited.headers()["retry-after"]) > 0);
  assert.match(limited.headers()["cache-control"], /no-store/);
  assert.equal((await malformed("192.0.2.91")).status(), 400);

  const limits = createMutationLimits(database.db);
  await limits.notificationsRead.consume(studentId, 120).catch(() => {});
  const perUser = await api.get(notifications);
  assert.equal(perUser.status(), 429);
  assert.ok(Number(perUser.headers()["retry-after"]) > 0);
  const anonymous = await fixture.browser.newContext();
  try {
    assert.equal((await anonymous.request.get(notifications)).status(), 401);
    const floodHeaders = { "X-Forwarded-For": "192.0.2.92" };
    const key = requestLimitKey(new Request(notifications, { headers: floodHeaders }));
    await limits.apiRequest.consume(key, 240);
    const denied = await anonymous.request.get(notifications, { headers: floodHeaders });
    assert.equal(denied.status(), 429);
    assert.ok(Number(denied.headers()["retry-after"]) > 0);
  } finally {
    await anonymous.close();
  }

  await database.db.execute(
    sql`alter table ${mutationLimits} rename to student_mutation_limit_offline`,
  );
  try {
    for (const url of [auth + "get-session/", notifications]) {
      const response = await context.request.get(url);
      assert.equal(response.status(), 503);
      assert.deepEqual(await response.json(), { error: "Service unavailable" });
    }
  } finally {
    await database.db.execute(
      sql`alter table student_mutation_limit_offline rename to student_mutation_limit`,
    );
  }
  console.log(
    "PASS backend guards: authenticated sessions, strict origins/query/body validation, pre-validation IP budgets, anonymous and per-user limits, Retry-After and fail-closed storage outages.",
  );
} finally {
  try {
    await fixture?.close();
  } finally {
    await database.close();
  }
}
