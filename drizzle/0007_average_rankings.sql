ALTER TABLE "student_weekly_stat" DROP CONSTRAINT IF EXISTS "student_weekly_stat_week_student_weekly_run_week_fk";
--> statement-breakpoint
ALTER TABLE "student_weekly_stat" DROP CONSTRAINT IF EXISTS "student_weekly_stat_week_fkey";--> statement-breakpoint
ALTER TABLE "student_weekly_stat" DROP CONSTRAINT IF EXISTS "student_weekly_stat_week_student_id_pk";--> statement-breakpoint
ALTER TABLE "student_weekly_stat" DROP CONSTRAINT IF EXISTS "student_weekly_stat_pkey";--> statement-breakpoint
ALTER TABLE "student_weekly_run" DROP CONSTRAINT "student_weekly_run_pkey";--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ALTER COLUMN "weighted_points" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ALTER COLUMN "overall_rank" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_run" ADD COLUMN "policy_version" text DEFAULT 'weighted-total-v1' NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD COLUMN "policy_version" text DEFAULT 'weighted-total-v1' NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD COLUMN "raw_average" numeric;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD COLUMN "inactivity_penalty" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD COLUMN "inactive_months" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD COLUMN "course_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "student_weekly_run" ADD CONSTRAINT "student_weekly_run_week_policy_version_pk" PRIMARY KEY("week","policy_version");--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD CONSTRAINT "student_weekly_stat_week_policy_version_student_id_pk" PRIMARY KEY("week","policy_version","student_id");--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD CONSTRAINT "student_weekly_stat_week_policy_version_student_weekly_run_week_policy_version_fk" FOREIGN KEY ("week","policy_version") REFERENCES "public"."student_weekly_run"("week","policy_version") ON DELETE cascade ON UPDATE no action;
