import { RateLimiterDrizzle, RateLimiterRes } from "rate-limiter-flexible";
import { mutationLimits } from "../db/schema/security.js";
import { studentAuthPolicy } from "../student-auth/config.js";
import { serviceDiagnostic } from "./service-diagnostic.js";

const mutationPolicies = {
  write: [40, 60],
  profile: [8, 60],
  login: [20, 600],
  loginRequest: [30, 60],
  authRequest: [180, 60],
  apiRequest: [240, 60],
  emailSend: [3, 3600],
  emailCooldown: [1, studentAuthPolicy.emailResendSeconds],
  emailVerify: [10, 600],
  directory: [60, 60],
  notificationsRead: [120, 60],
  notificationsWrite: [30, 60],
  push: [10, 60],
};

export function createMutationLimits(db) {
  return Object.fromEntries(
    Object.entries(mutationPolicies).map(([scope, [points, duration]]) => [
      scope,
      new RateLimiterDrizzle({
        storeClient: db,
        schema: mutationLimits,
        keyPrefix: scope,
        points,
        duration,
        clearExpiredByTimeout: false,
      }),
    ]),
  );
}

export async function consumeMutationLimit(limits, userId, scope = "write") {
  const general = await consumeRateLimit(limits.write, userId);
  if (general.status || scope === "write") return general.status;
  return (await consumeRateLimit(limits[scope], userId)).status;
}

export async function consumeRateLimit(limiter, key) {
  try {
    await limiter.consume(key);
    return { status: null };
  } catch (error) {
    if (error instanceof RateLimiterRes)
      return { status: "limit", retryAfter: Math.max(1, Math.ceil(error.msBeforeNext / 1000)) };
    console.error("Mutation limiter unavailable", serviceDiagnostic(error));
    return { status: "failed" };
  }
}
