import { createStudentAuth } from "../src/lib/student-auth/server.js";
import { studentAuthPolicy } from "../src/lib/student-auth/config.js";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";
import { seedAcademyDemo } from "./students/seed-demo.mjs";

const password = process.env.ACADEMY_DEMO_PASSWORD;
if (
  !password ||
  password.length < studentAuthPolicy.password.min ||
  password.length > studentAuthPolicy.password.max
) {
  console.error("Set ACADEMY_DEMO_PASSWORD to a valid demo-account password.");
  process.exit(1);
}
const { auth, db, pool } = createStudentAuth({ provision: true });
try {
  await migrateStudentDatabase(db);
  const result = await seedAcademyDemo({ auth, db, password });
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  console.error("Demo seed failed:", error.body?.code ?? error.cause?.code ?? error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
