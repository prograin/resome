import { sql } from "drizzle-orm";
import {
  check,
  foreignKey,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { courseDefinitions } from "./course-definitions.js";
import { enrollmentStatuses } from "../../course-options.js";

const id = () => integer().primaryKey().generatedAlwaysAsIdentity();
const student = () =>
  text("student_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" });

export const courses = pgTable(
  "student_course",
  {
    id: id(),
    studentId: student(),
    definitionId: integer("definition_id")
      .notNull()
      .references(() => courseDefinitions.id),
    title: text().notNull(),
    status: text({ enum: enrollmentStatuses }).notNull().default("active"),
    difficulty: text(),
    github: text("github_url"),
    playlist: text("playlist_url"),
    syllabus: text()
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
  },
  (t) => [
    unique().on(t.studentId, t.id),
    check("student_course_status_check", sql`${t.status} in ('active', 'inactive', 'completed')`),
    index("student_course_student_idx").on(t.studentId),
    index("student_course_definition_idx").on(t.definitionId),
    check("student_course_title_check", sql`length(btrim(${t.title})) between 1 and 100`),
    check(
      "student_course_difficulty_check",
      sql`${t.difficulty} in ('beginner', 'intermediate', 'advanced')`,
    ),
    check("student_course_github_url_check", sql`length(${t.github}) <= 2048`),
    check("student_course_playlist_url_check", sql`length(${t.playlist}) <= 2048`),
  ],
);

export const videos = pgTable(
  "student_course_video",
  {
    id: id(),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text().notNull(),
    url: text().notNull(),
  },
  (t) => [
    unique().on(t.courseId, t.url),
    check("student_course_video_title_check", sql`length(btrim(${t.title})) between 1 and 160`),
    check("student_course_video_description_check", sql`length(${t.description}) <= 1000`),
    check("student_course_video_url_check", sql`length(${t.url}) between 1 and 2048`),
  ],
);

export const awards = pgTable(
  "student_award",
  {
    id: id(),
    studentId: student(),
    courseId: integer("course_id"),
    points: integer().notNull(),
    kind: text().notNull(),
    note: text().notNull().default(""),
    recordedAt: timestamp("recorded_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    foreignKey({
      columns: [t.studentId, t.courseId],
      foreignColumns: [courses.studentId, courses.id],
    }),
    index("student_award_student_history_idx").on(t.studentId, t.recordedAt.desc(), t.id.desc()),
    check("student_award_points_check", sql`${t.points} between 1 and 5`),
    check("student_award_kind_check", sql`${t.kind} in ('session', 'followup', 'other')`),
    check("student_award_note_check", sql`length(${t.note}) <= 500`),
  ],
);

export const goals = pgTable(
  "student_goal",
  {
    id: id(),
    studentId: student(),
    title: text().notNull(),
    priority: integer().notNull(),
    studentPercent: integer("student_percent").notNull(),
    description: text().notNull().default(""),
  },
  (t) => [
    index("student_goal_priority_idx").on(t.studentId, t.priority, t.id),
    check("student_goal_title_check", sql`length(btrim(${t.title})) between 1 and 160`),
    check("student_goal_priority_check", sql`${t.priority} between 1 and 3`),
    check("student_goal_student_percent_check", sql`${t.studentPercent} between 0 and 100`),
    check("student_goal_description_check", sql`length(${t.description}) <= 1000`),
  ],
);
