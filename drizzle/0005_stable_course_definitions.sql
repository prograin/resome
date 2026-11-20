CREATE TABLE "student_course_definition" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_course_definition_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	CONSTRAINT "student_course_definition_title_check" CHECK (length(btrim("student_course_definition"."title")) between 1 and 100)
);
--> statement-breakpoint
ALTER TABLE "student_course" ADD COLUMN "definition_id" integer;--> statement-breakpoint
INSERT INTO "student_course_definition" ("title")
SELECT DISTINCT btrim("title") FROM "student_course" ORDER BY btrim("title");--> statement-breakpoint
UPDATE "student_course" AS enrollment
SET "definition_id" = definition."id"
FROM "student_course_definition" AS definition
WHERE btrim(enrollment."title") = definition."title";--> statement-breakpoint
ALTER TABLE "student_course" ALTER COLUMN "definition_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_definition_id_student_course_definition_id_fk" FOREIGN KEY ("definition_id") REFERENCES "public"."student_course_definition"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_course_definition_idx" ON "student_course" USING btree ("definition_id");
