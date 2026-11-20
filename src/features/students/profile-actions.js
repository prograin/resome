"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireStudentSession } from "../../lib/student-auth/session";
import { getStudentAuth } from "../../lib/student-auth/server";
import { studentPaths } from "../../lib/student-auth/paths";
import { adminUsername, isStudentAdmin } from "../../lib/student-progress";
import { parseOperation } from "../../lib/validation/forms";
import { emailInput, profileInput } from "../../lib/validation/profile";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { visibleStudentEmail } from "../../lib/student-auth/student-email";

export async function saveStudentProfile(operation, _previous, form) {
  const { user } = await requireStudentSession();
  const limited = await limitStudentAction(user.id, "profile");
  if (limited) return limited;
  const values = parseOperation({ details: profileInput, email: emailInput }, operation, form);
  if (!values) return "invalid";
  const auth = getStudentAuth();
  const requestHeaders = await headers();
  try {
    if (operation === "details") {
      if (values.username !== user.username) {
        if (isStudentAdmin(user)) return "adminUsername";
        if (values.username === adminUsername()) return "usernameTaken";
      }
      const name = [values.firstName, values.lastName].filter(Boolean).join(" ") || user.name;
      await auth.api.updateUser({ headers: requestHeaders, body: { ...values, name } });
    } else {
      if (visibleStudentEmail(user.email) || user.emailVerified) return "emailLocked";
      await auth.api.changeEmail({ headers: requestHeaders, body: { newEmail: values.email } });
      const updated = await auth.api.getSession({ headers: requestHeaders });
      if (updated?.user.email !== values.email) return "emailUnavailable";
    }
  } catch (error) {
    const code = error.body?.code ?? error.cause?.code ?? error.code;
    if (operation === "email" && code === "23514") return "emailLocked";
    if (code === "USERNAME_IS_ALREADY_TAKEN") return "usernameTaken";
    if (code === "23505") return operation === "email" ? "emailUnavailable" : "usernameTaken";
    if (code === "SESSION_IS_NOT_FRESH" || code === "SESSION_EXPIRED") return "freshSession";
    console.error("Student profile update failed", code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
