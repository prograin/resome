"use server";

import { requireStudentSession } from "../../lib/student-auth/session";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { adminUsername } from "../../lib/student-progress";
import { usernameInput } from "../../lib/validation/sign-in";
import { consumeRateLimit } from "../../lib/security/mutation-limit";
import { readStudentLinksPage } from "../../lib/db/student-links";

export async function loadStudentLinks(cursor) {
  const { user } = await requireStudentSession();
  const parsed = usernameInput.nullable().safeParse(cursor);
  if (!parsed.success) throw new Error("Invalid directory cursor.");
  const { db, limits } = getStudentRuntime();
  const limited = await consumeRateLimit(limits.directory, user.id);
  if (limited.status) throw new Error("Directory unavailable. Please try again later.");
  return readStudentLinksPage(db, adminUsername(), parsed.data);
}
