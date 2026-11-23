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
import { users } from "../../lib/db/schema/index";
import { eligibleStudent } from "../../lib/db/ranking-filters";

const activityInput = z.object({
  active: z.enum(["true", "false"]).transform((value) => value === "true"),
});

export async function setStudentActivity(studentId, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id, "profile");
  if (limited) return limited;
  const values = parseForm(activityInput, form);
  if (!values || !studentIdInput.safeParse(studentId).success) return "invalid";
  try {
    const changed = await getStudentRuntime()
      .db.update(users)
      .set({ academyActive: values.active, updatedAt: new Date() })
      .where(and(eq(users.id, studentId), eligibleStudent(adminUsername())))
      .returning({ id: users.id });
    if (!changed.length) return "invalid";
  } catch (error) {
    console.error("Student activity update failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
