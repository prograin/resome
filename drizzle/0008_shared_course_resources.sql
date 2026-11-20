CREATE TABLE "student_course_definition_video" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_course_definition_video_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"definition_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "student_course_definition_video_definition_id_url_unique" UNIQUE("definition_id","url"),
	CONSTRAINT "definition_video_title_check" CHECK (length(btrim("student_course_definition_video"."title")) between 1 and 160),
	CONSTRAINT "definition_video_description_check" CHECK (length("student_course_definition_video"."description") <= 1000),
	CONSTRAINT "definition_video_url_check" CHECK (length("student_course_definition_video"."url") between 1 and 2048)
);
--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD COLUMN "shared_content" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD COLUMN "difficulty" text;--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD COLUMN "github_url" text;--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD COLUMN "playlist_url" text;--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD COLUMN "syllabus" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "student_course_definition_video" ADD CONSTRAINT "student_course_definition_video_definition_id_student_course_definition_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."student_course_definition"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD CONSTRAINT "course_definition_difficulty_check" CHECK ("student_course_definition"."difficulty" in ('beginner', 'intermediate', 'advanced'));--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD CONSTRAINT "course_definition_github_check" CHECK (length("student_course_definition"."github_url") <= 2048);--> statement-breakpoint
ALTER TABLE "student_course_definition" ADD CONSTRAINT "course_definition_playlist_check" CHECK (length("student_course_definition"."playlist_url") <= 2048);
--> statement-breakpoint
UPDATE "student_course_definition" AS definition
SET "difficulty" = latest."difficulty", "github_url" = latest."github_url",
    "playlist_url" = latest."playlist_url", "syllabus" = latest."syllabus"
FROM (SELECT DISTINCT ON ("definition_id") * FROM "student_course" ORDER BY "definition_id", "id" DESC) AS latest
WHERE definition."id" = latest."definition_id";
--> statement-breakpoint
INSERT INTO "student_course_definition_video" ("definition_id", "title", "description", "url")
SELECT latest."definition_id", video."title", video."description", video."url"
FROM (SELECT DISTINCT ON ("definition_id") "id", "definition_id" FROM "student_course" ORDER BY "definition_id", "id" DESC) AS latest
JOIN "student_course_video" AS video ON video."course_id" = latest."id"
ORDER BY video."id"
ON CONFLICT ("definition_id", "url") DO NOTHING;
