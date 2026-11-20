CREATE TABLE "student_account" (
	"id" text PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"password" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_award" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_award_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"student_id" text NOT NULL,
	"course_id" integer,
	"points" integer NOT NULL,
	"kind" text NOT NULL,
	"note" text DEFAULT '' NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_award_points_check" CHECK ("student_award"."points" between 1 and 5),
	CONSTRAINT "student_award_kind_check" CHECK ("student_award"."kind" in ('session', 'followup', 'other')),
	CONSTRAINT "student_award_note_check" CHECK (length("student_award"."note") <= 500)
);
--> statement-breakpoint
CREATE TABLE "student_course" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_course_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"student_id" text NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"difficulty" text,
	"github_url" text,
	"playlist_url" text,
	"syllabus" text[] DEFAULT '{}'::text[] NOT NULL,
	CONSTRAINT "student_course_student_id_id_unique" UNIQUE("student_id","id"),
	CONSTRAINT "student_course_title_check" CHECK (length(btrim("student_course"."title")) between 1 and 100),
	CONSTRAINT "student_course_difficulty_check" CHECK ("student_course"."difficulty" in ('beginner', 'intermediate', 'advanced')),
	CONSTRAINT "student_course_github_url_check" CHECK (length("student_course"."github_url") <= 2048),
	CONSTRAINT "student_course_playlist_url_check" CHECK (length("student_course"."playlist_url") <= 2048)
);
--> statement-breakpoint
CREATE TABLE "student_goal" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_goal_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"student_id" text NOT NULL,
	"title" text NOT NULL,
	"priority" integer NOT NULL,
	"student_percent" integer NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	CONSTRAINT "student_goal_title_check" CHECK (length(btrim("student_goal"."title")) between 1 and 160),
	CONSTRAINT "student_goal_priority_check" CHECK ("student_goal"."priority" between 1 and 3),
	CONSTRAINT "student_goal_student_percent_check" CHECK ("student_goal"."student_percent" between 0 and 100),
	CONSTRAINT "student_goal_description_check" CHECK (length("student_goal"."description") <= 1000)
);
--> statement-breakpoint
CREATE TABLE "student_rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"count" integer NOT NULL,
	"lastRequest" bigint NOT NULL,
	CONSTRAINT "student_rate_limit_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "student_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"userId" text NOT NULL,
	CONSTRAINT "student_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "student_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"username" text,
	"displayUsername" text,
	CONSTRAINT "student_user_email_unique" UNIQUE("email"),
	CONSTRAINT "student_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "student_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_course_video" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_course_video_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"course_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "student_course_video_course_id_url_unique" UNIQUE("course_id","url"),
	CONSTRAINT "student_course_video_title_check" CHECK (length(btrim("student_course_video"."title")) between 1 and 160),
	CONSTRAINT "student_course_video_description_check" CHECK (length("student_course_video"."description") <= 1000),
	CONSTRAINT "student_course_video_url_check" CHECK (length("student_course_video"."url") between 1 and 2048)
);
--> statement-breakpoint
CREATE TABLE "student_weekly_run" (
	"week" date PRIMARY KEY NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_weekly_stat" (
	"week" date NOT NULL,
	"student_id" text NOT NULL,
	"average" numeric,
	"assessments" integer NOT NULL,
	"weighted_points" bigint NOT NULL,
	"overall_rank" bigint NOT NULL,
	"course_id" integer,
	"course_title" text,
	"course_rank" bigint,
	CONSTRAINT "student_weekly_stat_week_student_id_pk" PRIMARY KEY("week","student_id")
);
--> statement-breakpoint
ALTER TABLE "student_account" ADD CONSTRAINT "student_account_userId_student_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_award" ADD CONSTRAINT "student_award_student_id_student_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_award" ADD CONSTRAINT "student_award_student_id_course_id_student_course_student_id_id_fk" FOREIGN KEY ("student_id","course_id") REFERENCES "public"."student_course"("student_id","id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_course" ADD CONSTRAINT "student_course_student_id_student_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_goal" ADD CONSTRAINT "student_goal_student_id_student_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_session" ADD CONSTRAINT "student_session_userId_student_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_course_video" ADD CONSTRAINT "student_course_video_course_id_student_course_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."student_course"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD CONSTRAINT "student_weekly_stat_week_student_weekly_run_week_fk" FOREIGN KEY ("week") REFERENCES "public"."student_weekly_run"("week") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_weekly_stat" ADD CONSTRAINT "student_weekly_stat_student_id_student_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_account_user_idx" ON "student_account" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "student_award_student_history_idx" ON "student_award" USING btree ("student_id","id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "student_course_student_idx" ON "student_course" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_goal_priority_idx" ON "student_goal" USING btree ("student_id","priority","id");--> statement-breakpoint
CREATE INDEX "student_session_user_idx" ON "student_session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "student_weekly_stat_student_idx" ON "student_weekly_stat" USING btree ("student_id","week" DESC NULLS LAST);