import { createDatabase } from "../src/lib/db/client.js";
import { captureWeeklyStats } from "../src/lib/student-weekly.js";
import { clearExpiredSecurityRecords } from "../src/lib/security/cleanup.js";

const { pool, db } = createDatabase();
try {
  console.log(
    await captureWeeklyStats(db, process.env.STUDENT_ADMIN_USERNAME?.trim().toLowerCase() || null),
  );
  await clearExpiredSecurityRecords(db);
} finally {
  await pool.end();
}
