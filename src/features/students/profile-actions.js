"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireStudentSession } from "../../lib/student-auth/session";
import { getStudentAuth } from "../../lib/student-auth/server";
import { studentPaths } from "../../lib/student-auth/paths";
import { adminUsername, isStudentAdmin } from "../../lib/student-progress";
import { parseOperation } from "../../lib/validation/forms";
import { profileInput } from "../../lib/validation/profile";
import { limitStudentAction } from "../../lib/student-auth/action-limit";

export async function saveStudentProfile(operation, _previous, form) {
  const { user } = await requireStudentSession();
  const limited = await limitStudentAction(user.id, "profile");
  if (limited) return limited;
  const values = parseOperation({ details: profileInput }, operation, form);
  if (!values) return "invalid";
  const auth = getStudentAuth();
  const requestHeaders = await headers();
  try {
    if (values.username !== user.username) {
      if (isStudentAdmin(user)) return "adminUsername";
      if (values.username === adminUsername()) return "usernameTaken";
    }
    const name = [values.firstName, values.lastName].filter(Boolean).join(" ") || user.name;
    await auth.api.updateUser({ headers: requestHeaders, body: { ...values, name } });
  } catch (error) {
    const code = error.body?.code ?? error.cause?.code ?? error.code;
    if (code === "USERNAME_IS_ALREADY_TAKEN") return "usernameTaken";
    if (code === "23505") return "usernameTaken";
    if (code === "SESSION_IS_NOT_FRESH" || code === "SESSION_EXPIRED") return "freshSession";
    console.error("Student profile update failed", code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
