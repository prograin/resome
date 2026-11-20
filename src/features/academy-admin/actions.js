"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { requireStudentSession } from "../../lib/student-auth/session";
import { adminUsername, isStudentAdmin } from "../../lib/student-progress";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { createStudentAuth } from "../../lib/student-auth/server";
import { createStudentInput } from "../../lib/validation/admin";
import { parseForm } from "../../lib/validation/forms";
import { studentPaths } from "../../lib/student-auth/paths";
import { users } from "../../lib/db/schema/index";
import { internalStudentEmail } from "../../lib/student-auth/student-email";

export async function createAcademyStudent(_previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id, "profile");
  if (limited) return limited;
  const values = parseForm(createStudentInput, form);
  if (!values || values.username === adminUsername()) return "invalid";
  const { auth, pool, db } = createStudentAuth({ provision: true });
  try {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.username, values.username))
      .limit(1);
    if (existing) return "duplicate";
    const result = await auth.api.signUpEmail({
      body: {
        ...values,
        name: `${values.firstName} ${values.lastName}`,
        email: internalStudentEmail(randomUUID()),
      },
    });
    // Better Auth can intentionally return a synthetic success for an existing email.
    const [created] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, result.user.id))
      .limit(1);
    if (!created) return "duplicate";
  } catch (error) {
    const code = error.body?.code;
    if (
      [
        "USERNAME_IS_ALREADY_TAKEN",
        "USER_ALREADY_EXISTS",
        "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
      ].includes(code)
    )
      return "duplicate";
    console.error("Academy account creation failed", code ?? error.cause?.code ?? error.code);
    return "failed";
  } finally {
    await pool.end();
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
