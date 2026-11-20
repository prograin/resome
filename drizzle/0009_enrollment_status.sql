ALTER TABLE "student_course" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
UPDATE "student_course" SET "status" = CASE WHEN "completed" THEN 'completed' ELSE 'active' END;--> statement-breakpoint
ALTER TABLE "student_course" DROP COLUMN "completed";--> statement-breakpoint
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_status_check" CHECK ("student_course"."status" in ('active', 'inactive', 'completed'));