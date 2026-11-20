import { sql } from "drizzle-orm";

export function scoreTime(now) {
  return now ? sql`${now.toISOString()}::timestamptz` : sql`statement_timestamp()`;
}
