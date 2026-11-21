import assert from "node:assert/strict";
import { sendAwardEmail } from "../src/lib/email/send-award-email.js";

const previousFetch = globalThis.fetch;
const variables = ["RESEND_API_KEY", "RESEND_FROM_EMAIL", "BETTER_AUTH_URL", "RESEND_DEBUG"];
const previousEnvironment = variables.map((key) => process.env[key]);
Object.assign(process.env, {
  RESEND_API_KEY: "re_mock_only",
  RESEND_FROM_EMAIL: "Academy <test@example.test>",
  BETTER_AUTH_URL: "https://academy.example.test",
  RESEND_DEBUG: "false",
});
const message = {
  email: "student@example.test",
  idempotencyKey: "academy-notification-delivery-123",
  note: "تمرین‌ها خوب انجام شدند.\n<script>این متن ساده است</script>",
  notification: { id: 123, kind: "award", entityId: 12, points: 4, courseTitle: "<test>" },
};
async function scenario(statuses, expectedAttempts, succeeds = true) {
  const requests = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.resend.com/emails");
    requests.push(options);
    const status = statuses[requests.length - 1];
    assert.notEqual(status, undefined, "unexpected extra attempt");
    if (status === "network") throw new TypeError("fetch failed");
    return Response.json(
      status === 200
        ? { id: "mock-email" }
        : {
            statusCode: status,
            name: status === 429 ? "rate_limit_exceeded" : "application_error",
            message: "private provider detail student@example.test",
          },
      { status },
    );
  };
  if (succeeds) await sendAwardEmail(message);
  else
    await assert.rejects(sendAwardEmail(message), (error) => {
      assert.ok(!error.message.includes("student@example.test"));
      return true;
    });
  assert.equal(requests.length, expectedAttempts);
  for (const request of requests) {
    assert.equal(new Headers(request.headers).get("Idempotency-Key"), message.idempotencyKey);
    assert.ok(request.signal instanceof AbortSignal);
    assert.equal(request.signal.aborted, false);
    assert.equal(request.body, requests[0].body, "retry must reuse the same payload");
  }
  assert.equal(new Set(requests.map(({ signal }) => signal)).size, requests.length);
  const payload = JSON.parse(requests[0].body);
  assert.equal(payload.html, undefined);
  assert.ok(payload.text.includes("https://academy.example.test/"));
  if (message.note.trim())
    assert.ok(payload.text.includes(`توضیحات استاد:\n${message.note.trim()}`));
  else assert.ok(!payload.text.includes("توضیحات استاد:"));
}
try {
  await scenario([200], 1);
  await scenario([429, 503, 200], 3);
  await scenario(["network", 200], 2);
  await scenario([502, 502, 502], 3, false);
  for (const status of [400, 401, 403, 409, 422]) await scenario([status], 1, false);
  message.note = "   ";
  await scenario([200], 1);
  await assert.rejects(sendAwardEmail({ ...message, notification: { kind: "course" } }));
  console.log(
    "PASS mocked award email: transient retries capped at two, stable idempotency/payload, fresh request signals, permanent 4xx rejection and no real sends.",
  );
} finally {
  globalThis.fetch = previousFetch;
  variables.forEach((key, index) => {
    if (previousEnvironment[index] === undefined) delete process.env[key];
    else process.env[key] = previousEnvironment[index];
  });
}
