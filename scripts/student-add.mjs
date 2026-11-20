import { parseArgs } from "node:util";
import { createStudentAuth } from "../src/lib/student-auth/server.js";

const { values } = parseArgs({
  options: { username: { type: "string" }, email: { type: "string" }, name: { type: "string" } },
});
const password = process.env.STUDENT_PASSWORD;
if (!values.username || !values.email || !values.name || !password) {
  console.error("Set STUDENT_PASSWORD and pass --username, --email and --name.");
  process.exit(1);
}

const { auth, pool } = createStudentAuth({ provision: true });
try {
  await auth.api.signUpEmail({ body: { ...values, password } });
  console.log("Student account created.");
} catch (error) {
  console.error(
    "Student account could not be created:",
    error.body?.message || error.code || error.message,
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
