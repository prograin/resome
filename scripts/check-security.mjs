import assert from "node:assert/strict";
import { readAuthEnvironment } from "../src/lib/security/environment.js";
import { validateAuthRequest } from "../src/lib/security/auth-request.js";
import { securityHeaders } from "../src/lib/security/headers.js";
import { parseForm } from "../src/lib/validation/forms.js";
import { goalInput } from "../src/lib/validation/goals.js";

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
  assert.throws(() => readAuthEnvironment({ ...config, ...invalid }), /configuration/);
}
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
const headers = Object.fromEntries(securityHeaders().map(({ key, value }) => [key, value]));
assert.equal(headers["X-Content-Type-Options"], "nosniff");
assert.equal(headers["X-Frame-Options"], "DENY");
assert.ok(!headers["Content-Security-Policy"].includes("unsafe-eval"));
assert.match(headers["Content-Security-Policy"], /frame-ancestors 'none'/);
console.log(
  "PASS security: Zod configuration, bounded streaming bodies, tampered forms and headers.",
);
