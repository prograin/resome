"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { requireStudentSession } from "../../lib/student-auth/session";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { changeProfileEmail } from "../../lib/student-auth/profile-email";
import { studentPaths } from "../../lib/student-auth/paths";
import { parseOperation } from "../../lib/validation/forms";
import { emailInput, emailVerificationInput } from "../../lib/validation/profile";

export async function saveProfileEmail(operation, _previous, form) {
  const { user } = await requireStudentSession();
  const values = parseOperation(
    { send: emailInput, verify: emailVerificationInput },
    operation,
    form,
  );
  if (!values) return "invalid";
  const result = await changeProfileEmail(
    getStudentRuntime(),
    user.id,
    await headers(),
    operation,
    values,
  );
  if (result === "saved") revalidatePath(studentPaths.dashboard, "layout");
  return result;
}
