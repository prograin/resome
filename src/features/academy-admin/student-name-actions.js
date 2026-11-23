"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { requireStudentSession } from "../../lib/student-auth/session";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { adminUsername, isStudentAdmin } from "../../lib/student-progress";
import { studentPaths } from "../../lib/student-auth/paths";
import { createStudentInput } from "../../lib/validation/admin";
import { parseForm, studentIdInput } from "../../lib/validation/forms";
import { users } from "../../lib/db/schema/index";
import { eligibleStudent } from "../../lib/db/rankings";

const nameInput = createStudentInput.pick({ firstName: true, lastName: true });

export async function updateStudentName(studentId, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id, "profile");
  if (limited) return limited;
  const values = parseForm(nameInput, form);
  if (!values || !studentIdInput.safeParse(studentId).success) return "invalid";
  try {
    const updated = await getStudentRuntime()
      .db.update(users)
      .set({ ...values, name: `${values.firstName} ${values.lastName}`, updatedAt: new Date() })
      .where(and(eq(users.id, studentId), eligibleStudent(adminUsername())))
      .returning({ id: users.id });
    if (!updated.length) return "invalid";
  } catch (error) {
    console.error("Student name update failed", error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
