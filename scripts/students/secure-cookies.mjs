import assert from "node:assert/strict";
import { parseSetCookieHeader } from "better-auth/cookies";
import { createStudentAuth } from "../../src/lib/student-auth/server.js";

export async function checkSecureCookies({ username, password }) {
  const origin = "https://students.example.test";
  const previous = process.env.BETTER_AUTH_URL;
  let runtime;
  try {
    process.env.BETTER_AUTH_URL = origin;
    runtime = createStudentAuth();
  } finally {
    process.env.BETTER_AUTH_URL = previous;
  }
  const request = (path, cookie, body) =>
    new Request(origin + "/api/auth/" + path, {
      method: body ? "POST" : "GET",
      headers: {
        Origin: origin,
        "Content-Type": "application/json",
        "X-Forwarded-For": "192.0.2.231",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  try {
    const signIn = async () => {
      const response = await runtime.auth.handler(
        request("sign-in/username", null, { username, password }),
      );
      assert.equal(response.status, 200);
      const [name, cookie] = [...parseSetCookieHeader(response.headers.get("set-cookie"))].find(
        ([key]) => key.includes("session_token"),
      );
      assert.ok(name.startsWith("__Secure-"));
      assert.equal(cookie.secure, true);
      assert.equal(cookie.httponly, true);
      assert.equal(cookie.samesite.toLowerCase(), "lax");
      return `${name}=${cookie.value}`;
    };
    const first = await signIn();
    const second = await signIn();
    assert.notEqual(first, second, "Each sign-in creates its own signed token");
    const tampered = first.slice(0, -3) + (first.at(-3) === "a" ? "b" : "a") + first.slice(-2);
    assert.equal(await (await runtime.auth.handler(request("get-session", tampered))).json(), null);
    assert.equal((await runtime.auth.handler(request("sign-out", first, {}))).status, 200);
    assert.equal(await (await runtime.auth.handler(request("get-session", first))).json(), null);
    assert.ok((await (await runtime.auth.handler(request("get-session", second))).json())?.session);
  } finally {
    await runtime.pool.end();
  }
}
