CREATE TABLE "student_notification_delivery" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_notification_delivery_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"notification_id" integer NOT NULL,
	"channel" text NOT NULL,
	"target" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_until" timestamp with time zone,
	"claim_token" text,
	"first_attempt_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"last_error" text,
	CONSTRAINT "student_notification_delivery_notification_id_channel_target_unique" UNIQUE("notification_id","channel","target"),
	CONSTRAINT "student_notification_delivery_channel_check" CHECK ("student_notification_delivery"."channel" in ('email', 'push')),
	CONSTRAINT "student_notification_delivery_status_check" CHECK ("student_notification_delivery"."status" in ('pending', 'processing', 'sent', 'skipped', 'failed'))
);
--> statement-breakpoint
CREATE TABLE "student_notification" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "student_notification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"student_id" text NOT NULL,
	"kind" text NOT NULL,
	"entity_id" integer NOT NULL,
	"points" integer,
	"course_title" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"read_at" timestamp with time zone,
	CONSTRAINT "student_notification_student_id_kind_entity_id_unique" UNIQUE("student_id","kind","entity_id"),
	CONSTRAINT "student_notification_kind_check" CHECK ("student_notification"."kind" in ('award', 'course')),
	CONSTRAINT "student_notification_points_check" CHECK ("student_notification"."points" between 1 and 5)
);
--> statement-breakpoint
CREATE TABLE "student_push_subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"student_id" text NOT NULL,
	"endpoint" text NOT NULL,
	"p256dh" text NOT NULL,
	"auth" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_push_subscription_endpoint_unique" UNIQUE("endpoint")
);
--> statement-breakpoint
ALTER TABLE "student_notification_delivery" ADD CONSTRAINT "student_notification_delivery_notification_id_student_notification_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."student_notification"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_notification" ADD CONSTRAINT "student_notification_student_id_student_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_push_subscription" ADD CONSTRAINT "student_push_subscription_student_id_student_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."student_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "student_notification_delivery_due_idx" ON "student_notification_delivery" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX "student_notification_recipient_idx" ON "student_notification" USING btree ("student_id","id" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "student_push_subscription_recipient_idx" ON "student_push_subscription" USING btree ("student_id");