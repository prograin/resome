import { createDatabase } from "../src/lib/db/client.js";
import { migrateStudentDatabase } from "../src/lib/db/migrate.js";

const { pool, db } = createDatabase();
try {
  await migrateStudentDatabase(db);
  console.log("Student ORM migrations are ready; existing data is preserved.");
} catch (error) {
  console.error("Student migration failed:", error.cause?.code || error.code || error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
