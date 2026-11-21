CREATE OR REPLACE FUNCTION "student_email_write_once_guard"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  -- Normalize the same internal identity without allowing an email reset.
  IF lower(OLD."email") LIKE '%@students.prograin.invalid'
     AND NEW."email" = lower(OLD."email") THEN
    RETURN NEW;
  END IF;
  IF lower(OLD."email") NOT LIKE '%@students.prograin.invalid'
     OR lower(NEW."email") LIKE '%@students.prograin.invalid' THEN
    RAISE EXCEPTION 'Email can only be set once'
      USING ERRCODE = '23514', CONSTRAINT = 'student_email_write_once';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
UPDATE "student_user"
SET "email" = lower("email")
WHERE lower("email") LIKE '%@students.prograin.invalid'
  AND "email" <> lower("email");
