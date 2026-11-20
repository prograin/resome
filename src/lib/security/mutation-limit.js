import { RateLimiterDrizzle, RateLimiterRes } from "rate-limiter-flexible";
import { mutationLimits } from "../db/schema/security.js";

const mutationPolicies = { write: 40, profile: 8, login: 20 };

export function createMutationLimits(db) {
  return Object.fromEntries(
    Object.entries(mutationPolicies).map(([scope, points]) => [
      scope,
      new RateLimiterDrizzle({
        storeClient: db,
        schema: mutationLimits,
        keyPrefix: scope,
        points,
        duration: scope === "login" ? 600 : 60,
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
    console.error("Mutation limiter unavailable", error.cause?.code ?? error.code);
    return { status: "failed" };
  }
}
