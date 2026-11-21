import { createHmac } from "node:crypto";
import { z } from "zod";
import { consumeRateLimit } from "./mutation-limit.js";
import { rateLimitResponse } from "./api-response.js";

const address = z.union([z.ipv4(), z.ipv6()]);

export function requestLimitKey(request, environment = process.env) {
  const header = environment.VERCEL ? "x-vercel-forwarded-for" : "x-forwarded-for";
  const value = request.headers.get(header)?.split(",", 1)[0].trim();
  const parsed = address.safeParse(value);
  const client = parsed.success
    ? parsed.data.includes(":")
      ? new URL(`http://[${parsed.data}]/`).hostname
      : parsed.data
    : "unknown-client";
  // Missing or malformed proxy addresses share a bounded bucket, never a random key.
  return createHmac("sha256", environment.BETTER_AUTH_SECRET).update(client).digest("hex");
}

export async function limitBackendRequest(request, limits, scope) {
  return rateLimitResponse(await consumeRateLimit(limits[scope], requestLimitKey(request)));
}
