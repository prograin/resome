CREATE TABLE "student_mutation_limit" (
	"key" text PRIMARY KEY NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"expire" timestamp with time zone
);
--> statement-breakpoint
CREATE INDEX "student_mutation_limit_expire_idx" ON "student_mutation_limit" USING btree ("expire");