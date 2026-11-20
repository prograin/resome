"use server";

import { revalidatePath } from "next/cache";
import { studentPaths } from "../../lib/student-auth/paths";
import { requireStudentSession } from "../../lib/student-auth/session";
import { isStudentAdmin } from "../../lib/student-progress";
import { saveStudentGoal } from "../../lib/student-goals";
import { databaseId, parseForm } from "../../lib/validation/forms";
import { goalInput } from "../../lib/validation/goals";
import { limitStudentAction } from "../../lib/student-auth/action-limit";

export async function updateGoal(id, _previous, form) {
  const { user } = await requireStudentSession();
  if (isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id);
  if (limited) return limited;
  if (!databaseId.nullable().safeParse(id).success) return "invalid";
  const values = parseForm(goalInput, form, id === null ? { percent: "0" } : {});
  if (!values) return "invalid";

  try {
    const saved = await saveStudentGoal(user.id, id, values);
    if (!saved) return "invalid";
  } catch (error) {
    console.error("Student goal write failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.goals);
  revalidatePath(studentPaths.dashboard);
  return "saved";
}
