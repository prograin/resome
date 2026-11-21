import assert from "node:assert/strict";
import { readAuthEnvironment } from "../src/lib/security/environment.js";
import { validateAuthRequest } from "../src/lib/security/auth-request.js";
import { securityHeaders } from "../src/lib/security/headers.js";
import { parseForm } from "../src/lib/validation/forms.js";
import { goalInput } from "../src/lib/validation/goals.js";
import { trustedRequestOrigin } from "../src/lib/security/request-origin.js";
import { requestLimitKey } from "../src/lib/security/request-limit.js";
import { rateLimitResponse } from "../src/lib/security/api-response.js";
import { parseQuery } from "../src/lib/validation/forms.js";
import { notificationQueryInput } from "../src/lib/validation/notifications.js";
import { serviceDiagnostic } from "../src/lib/security/service-diagnostic.js";

const config = {
  DATABASE_URL: "postgresql://test@localhost/test",
  BETTER_AUTH_URL: "https://example.test",
  BETTER_AUTH_SECRET: "x".repeat(32),
};
assert.deepEqual(readAuthEnvironment(config), config);
for (const invalid of [
  { BETTER_AUTH_SECRET: "short" },
  { BETTER_AUTH_URL: "http://example.test" },
  { BETTER_AUTH_URL: "https://user:secret@example.test" },
  { BETTER_AUTH_URL: "https://example.test/path" },
  { DATABASE_URL: "https://example.test" },
]) {
  assert.throws(
    () => readAuthEnvironment({ ...config, ...invalid }),
    (error) => {
      assert.deepEqual(serviceDiagnostic(error), {
        code: "AUTH_CONFIG_INVALID",
        fields: Object.keys(invalid),
      });
      assert.ok(!JSON.stringify(serviceDiagnostic(error)).includes(Object.values(invalid)[0]));
      return true;
    },
  );
}
assert.deepEqual(serviceDiagnostic(new TypeError("private password")), {
  code: "SERVICE_FAILED",
  type: "TypeError",
});
assert.deepEqual(
  serviceDiagnostic(new Error("private query", { cause: { code: "ECONNREFUSED" } })),
  {
    code: "ECONNREFUSED",
    type: "Error",
  },
);
const request = (body, contentType = "application/json") =>
  new Request("https://example.test/api/auth/sign-in/username/", {
    method: "POST",
    headers: { "Content-Type": contentType },
    body,
  });
const credentials = { username: "student", password: "test-password" };
const valid = await validateAuthRequest(request(JSON.stringify(credentials)), "sign-in/username");
assert.deepEqual(await valid.json(), credentials);
for (const data of [
  { ...credentials, password: "x".repeat(129) },
  { ...credentials, username: ["student"] },
  { ...credentials, username: "student name" },
  { ...credentials, password: new Blob(["not text"]) },
  { ...credentials, callbackURL: "https://evil.example" },
  { ...credentials, role: "admin" },
]) {
  assert.equal(
    (await validateAuthRequest(request(JSON.stringify(data)), "sign-in/username")).status,
    400,
  );
}
assert.equal((await validateAuthRequest(request("{"), "sign-in/username")).status, 400);
assert.equal(
  (await validateAuthRequest(request("x", "text/plain"), "sign-in/username")).status,
  415,
);
assert.equal(
  (await validateAuthRequest(request("x".repeat(9000)), "sign-in/username")).status,
  413,
);
const chunks = new ReadableStream({
  start(controller) {
    controller.enqueue(new TextEncoder().encode("x".repeat(5000)));
    controller.enqueue(new TextEncoder().encode("y".repeat(5000)));
    controller.close();
  },
});
const chunked = new Request("https://example.test/api/auth/sign-in/username/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: chunks,
  duplex: "half",
});
assert.equal((await validateAuthRequest(chunked, "sign-in/username")).status, 413);
const duplicate = new FormData();
duplicate.set("title", "Goal");
duplicate.set("priority", "1");
duplicate.append("priority", "3");
duplicate.set("percent", "0");
assert.equal(parseForm(goalInput, duplicate), null);
assert.equal(parseForm(goalInput, {}), null);
for (const origin of ["https://evil.example", "null", "https://example.test.evil.test"]) {
  assert.equal(
    trustedRequestOrigin(new Request(config.BETTER_AUTH_URL, { headers: { origin } }), config),
    false,
  );
}
assert.equal(trustedRequestOrigin(new Request(config.BETTER_AUTH_URL), config), false);
assert.equal(
  trustedRequestOrigin(
    new Request(config.BETTER_AUTH_URL, { headers: { origin: config.BETTER_AUTH_URL } }),
    config,
  ),
  true,
);
const key = (ip, extra = {}, environment = {}) =>
  requestLimitKey(
    new Request(config.BETTER_AUTH_URL, {
      headers: { "x-forwarded-for": ip, ...extra },
    }),
    { ...config, ...environment },
  );
assert.equal(key("2001:db8::1"), key("2001:0db8:0000:0000:0000:0000:0000:0001"));
assert.equal(key("bad-address"), key("another-invalid-address"));
assert.equal(
  key("192.0.2.1", { "x-vercel-forwarded-for": "192.0.2.8" }, { VERCEL: "1" }),
  key("192.0.2.8"),
);
assert.notEqual(key("192.0.2.1"), key("192.0.2.2"));
assert.equal(parseQuery(notificationQueryInput, new URLSearchParams("before=1&before=2")), null);
assert.equal(parseQuery(notificationQueryInput, new URLSearchParams("before=1&admin=true")), null);
assert.deepEqual(parseQuery(notificationQueryInput, new URLSearchParams("before=1")), {
  before: 1,
});
const limited = rateLimitResponse({ status: "limit", retryAfter: 12 });
assert.equal(limited.status, 429);
assert.equal(limited.headers.get("retry-after"), "12");
assert.match(limited.headers.get("cache-control"), /no-store/);
assert.equal(rateLimitResponse({ status: "failed" }).status, 503);
const headers = Object.fromEntries(securityHeaders().map(({ key, value }) => [key, value]));
assert.equal(headers["X-Content-Type-Options"], "nosniff");
assert.equal(headers["X-Frame-Options"], "DENY");
assert.ok(!headers["Content-Security-Policy"].includes("unsafe-eval"));
assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
console.log(
  "PASS security: Zod configuration, bounded streaming bodies, tampered forms and headers.",
);
