import { sql } from "drizzle-orm";
import { boolean, check, integer, pgTable, text, unique } from "drizzle-orm/pg-core";

export const courseDefinitions = pgTable(
  "student_course_definition",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    title: text().notNull(),
    sharedContent: boolean("shared_content").notNull().default(false),
    difficulty: text(),
    github: text("github_url"),
    playlist: text("playlist_url"),
    syllabus: text()
      .array()
      .notNull()
      .default(sql`'{}'::text[]`),
  },
  (table) => [
    check(
      "student_course_definition_title_check",
      sql`length(btrim(${table.title})) between 1 and 100`,
    ),
    check(
      "course_definition_difficulty_check",
      sql`${table.difficulty} in ('beginner', 'intermediate', 'advanced')`,
    ),
    check("course_definition_github_check", sql`length(${table.github}) <= 2048`),
    check("course_definition_playlist_check", sql`length(${table.playlist}) <= 2048`),
  ],
);

export const definitionVideos = pgTable(
  "student_course_definition_video",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    definitionId: integer("definition_id")
      .notNull()
      .references(() => courseDefinitions.id, { onDelete: "cascade" }),
    title: text().notNull(),
    description: text().notNull(),
    url: text().notNull(),
  },
  (t) => [
    unique().on(t.definitionId, t.url),
    check("definition_video_title_check", sql`length(btrim(${t.title})) between 1 and 160`),
    check("definition_video_description_check", sql`length(${t.description}) <= 1000`),
    check("definition_video_url_check", sql`length(${t.url}) between 1 and 2048`),
  ],
);
