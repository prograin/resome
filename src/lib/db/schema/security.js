import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const mutationLimits = pgTable(
  "student_mutation_limit",
  {
    key: text().primaryKey(),
    points: integer().notNull().default(0),
    expire: timestamp({ withTimezone: true }),
  },
  (table) => [index("student_mutation_limit_expire_idx").on(table.expire)],
);
