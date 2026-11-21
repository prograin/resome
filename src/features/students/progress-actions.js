"use server";

import { revalidatePath } from "next/cache";
import { studentPaths } from "../../lib/student-auth/paths";
import { requireStudentSession } from "../../lib/student-auth/session";
import { isStudentAdmin, writeStudentProgress } from "../../lib/student-progress";
import { parseOperation, studentIdInput } from "../../lib/validation/forms";
import { progressInputs } from "../../lib/validation/progress";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { scheduleNotificationDeliveries } from "../../lib/notifications/schedule";

export async function updateProgress(studentId, operation, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id);
  if (limited) return limited;
  if (!studentIdInput.safeParse(studentId).success) return "invalid";

  const values = parseOperation(progressInputs, operation, form);
  if (!values) return "invalid";

  try {
    if (!(await writeStudentProgress(studentId, operation, values))) return "invalid";
  } catch (error) {
    console.error("Student progress write failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard);
  revalidatePath(studentPaths.chart);
  revalidatePath(studentPaths.history);
  revalidatePath(studentPaths.courses);
  revalidatePath(studentPaths.admin);
  if (operation === "award") scheduleNotificationDeliveries();
  return "saved";
}
