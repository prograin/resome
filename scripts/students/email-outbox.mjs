import { appendFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

// Loaded only by the browser-test process; never sends real email.
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, options) => {
  const url = new URL(typeof input === "string" ? input : (input.url ?? input));
  if (url.hostname !== "api.resend.com") return originalFetch(input, options);
  if (url.pathname !== "/emails" || !process.env.STUDENT_TEST_EMAIL_OUTBOX)
    throw new Error("Unexpected email request in test fixture.");
  const email = JSON.parse(options.body);
  const otp = email.text.match(/\b\d{4}\b/)?.[0];
  appendFileSync(process.env.STUDENT_TEST_EMAIL_OUTBOX, JSON.stringify({ ...email, otp }) + "\n");
  return Response.json({ id: randomUUID() });
};
