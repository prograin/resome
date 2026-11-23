import { and, eq } from "drizzle-orm";
import { users } from "./schema/index.js";
import { eligibleStudent } from "./ranking-filters.js";
import { studentIdInput } from "../validation/forms.js";

export async function readManagedStudent(db, studentId, admin) {
  if (!studentIdInput.safeParse(studentId).success) return null;
  const [student] = await db
    .select({
      id: users.id,
      name: users.name,
      firstName: users.firstName,
      lastName: users.lastName,
      username: users.username,
    })
    .from(users)
    .where(and(eq(users.id, studentId), eligibleStudent(admin)))
    .limit(1);
  return student ?? null;
}
