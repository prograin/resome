"use server";

import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireStudentSession } from "../../lib/student-auth/session";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { studentPaths } from "../../lib/student-auth/paths";
import { adminUsername, isStudentAdmin } from "../../lib/student-progress";
import { parseForm, studentIdInput } from "../../lib/validation/forms";
import { users, sessions } from "../../lib/db/schema/index";
import { eligibleStudent } from "../../lib/db/ranking-filters";
import { studentAccountStatuses } from "../../lib/student-account";

const activityInput = z.object({
  status: z.enum(studentAccountStatuses),
});

export async function setStudentActivity(studentId, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id, "profile");
  if (limited) return limited;
  const values = parseForm(activityInput, form);
  if (!values || !studentIdInput.safeParse(studentId).success) return "invalid";
  try {
    const changed = await getStudentRuntime().db.transaction(async (tx) => {
      const where = and(eq(users.id, studentId), eligibleStudent(adminUsername()));
      const [student] = await tx
        .select({ banned: users.academyBanned })
        .from(users)
        .where(where)
        .for("update");
      if (!student) return false;
      const banned = values.status === "banned";
      await tx
        .update(users)
        .set({
          academyActive: values.status === "active",
          academyBanned: banned,
          academyInactiveReason: null,
          academyInactiveAt: values.status === "inactive" ? new Date() : null,
          updatedAt: new Date(),
        })
        .where(where);
      // Blocked tokens must not become usable again when the ban is lifted.
      if (student.banned && !banned)
        await tx.delete(sessions).where(eq(sessions.userId, studentId));
      return true;
    });
    if (!changed) return "invalid";
  } catch (error) {
    console.error("Student activity update failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
