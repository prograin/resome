import { timingSafeEqual } from "node:crypto";
import { z } from "zod";

export function authorizedCron(request) {
  const secret = process.env.CRON_SECRET;
  if (!z.string().min(32).safeParse(secret).success) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
