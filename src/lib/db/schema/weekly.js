import {
  bigint,
  date,
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { legacyRankingPolicy } from "../../scoring/policy.js";

export const weeklyRuns = pgTable(
  "student_weekly_run",
  {
    week: date().notNull(),
    policyVersion: text("policy_version").notNull().default(legacyRankingPolicy),
    recordedAt: timestamp("recorded_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.week, t.policyVersion] })],
);

export const weeklyStats = pgTable(
  "student_weekly_stat",
  {
    week: date().notNull(),
    policyVersion: text("policy_version").notNull().default(legacyRankingPolicy),
    studentId: text("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    average: numeric(),
    rawAverage: numeric("raw_average"),
    inactivityPenalty: numeric("inactivity_penalty").notNull().default("0"),
    inactiveMonths: integer("inactive_months").notNull().default(0),
    courseCount: integer("course_count").notNull().default(0),
    assessments: integer().notNull(),
    weightedPoints: bigint("weighted_points", { mode: "number" }),
    overallRank: bigint("overall_rank", { mode: "number" }),
    courseId: integer("course_id"),
    courseTitle: text("course_title"),
    courseRank: bigint("course_rank", { mode: "number" }),
  },
  (t) => [
    primaryKey({ columns: [t.week, t.policyVersion, t.studentId] }),
    foreignKey({
      columns: [t.week, t.policyVersion],
      foreignColumns: [weeklyRuns.week, weeklyRuns.policyVersion],
    }).onDelete("cascade"),
    index("student_weekly_stat_student_idx").on(t.studentId, t.week.desc()),
  ],
);
