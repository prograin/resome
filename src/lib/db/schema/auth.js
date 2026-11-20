import { bigint, boolean, integer, pgTable, text, timestamp, index } from "drizzle-orm/pg-core";

const date = (name) => timestamp(name, { withTimezone: true });
const timestamps = () => ({
  createdAt: date("createdAt").notNull().defaultNow(),
  updatedAt: date("updatedAt").notNull().defaultNow(),
});

export const users = pgTable("student_user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  image: text(),
  ...timestamps(),
  username: text().unique(),
  displayUsername: text(),
  firstName: text().notNull().default(""),
  lastName: text().notNull().default(""),
  github: text().notNull().default(""),
});

export const sessions = pgTable(
  "student_session",
  {
    id: text().primaryKey(),
    expiresAt: date("expiresAt").notNull(),
    token: text().notNull().unique(),
    ...timestamps(),
    ipAddress: text(),
    userAgent: text(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (t) => [
    index("student_session_user_idx").on(t.userId),
    index("student_session_expiry_idx").on(t.expiresAt),
  ],
);

export const accounts = pgTable(
  "student_account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: date("accessTokenExpiresAt"),
    refreshTokenExpiresAt: date("refreshTokenExpiresAt"),
    scope: text(),
    password: text(),
    ...timestamps(),
  },
  (t) => [index("student_account_user_idx").on(t.userId)],
);

export const verifications = pgTable(
  "student_verification",
  {
    id: text().primaryKey(),
    identifier: text().notNull(),
    value: text().notNull(),
    expiresAt: date("expiresAt").notNull(),
    ...timestamps(),
  },
  (t) => [index("student_verification_expiry_idx").on(t.expiresAt)],
);

export const rateLimits = pgTable("student_rate_limit", {
  id: text().primaryKey(),
  key: text().notNull().unique(),
  count: integer().notNull(),
  lastRequest: bigint({ mode: "number" }).notNull(),
});

export const authSchema = {
  student_user: users,
  student_session: sessions,
  student_account: accounts,
  student_verification: verifications,
  student_rate_limit: rateLimits,
};
