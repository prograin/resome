import { createHmac } from "node:crypto";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { consumeRateLimit } from "../security/mutation-limit.js";
import { usernameInput } from "../validation/sign-in.js";

export function loginRateLimit(limits, secret) {
  return createAuthMiddleware(async (context) => {
    if (context.path !== "/sign-in/username" || typeof context.body?.username !== "string") return;
    const parsed = usernameInput.safeParse(context.body.username);
    if (!parsed.success) return;
    const key = createHmac("sha256", secret).update(parsed.data).digest("hex");
    const result = await consumeRateLimit(limits.login, key);
    if (result.status === "limit") {
      throw new APIError(
        "TOO_MANY_REQUESTS",
        { code: "TOO_MANY_REQUESTS", message: "Too many attempts. Try again later." },
        { "Retry-After": String(result.retryAfter) },
      );
    }
    if (result.status)
      throw new APIError("SERVICE_UNAVAILABLE", { message: "Please try again later." });
  });
}
