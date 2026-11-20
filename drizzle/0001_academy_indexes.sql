CREATE INDEX IF NOT EXISTS student_course_student_idx ON student_course (student_id);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS student_account_user_idx ON student_account ("userId");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS student_session_user_idx ON student_session ("userId");
