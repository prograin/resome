CREATE FUNCTION "student_email_write_once_guard"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF lower(OLD."email") NOT LIKE '%@students.prograin.invalid'
     OR lower(NEW."email") LIKE '%@students.prograin.invalid' THEN
    RAISE EXCEPTION 'Email can only be set once'
      USING ERRCODE = '23514', CONSTRAINT = 'student_email_write_once';
  END IF;
  RETURN NEW;
END;
$$;
--> statement-breakpoint
CREATE TRIGGER "student_email_write_once"
BEFORE UPDATE OF "email" ON "student_user"
FOR EACH ROW WHEN (OLD."email" IS DISTINCT FROM NEW."email")
EXECUTE FUNCTION "student_email_write_once_guard"();
