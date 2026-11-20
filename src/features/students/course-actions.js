"use server";

import { revalidatePath } from "next/cache";
import { databaseId, studentIdInput, parseOperation } from "../../lib/validation/forms";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { courseInput, videoInput } from "../../lib/validation/courses";
import { studentPaths } from "../../lib/student-auth/paths";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { requireStudentSession } from "../../lib/student-auth/session";
import { isStudentAdmin } from "../../lib/student-progress";
import { updateCourseContent } from "../../lib/db/student-courses";

export async function saveCourseContent(studentId, courseId, operation, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id);
  if (limited) return limited;
  if (!studentIdInput.safeParse(studentId).success) return "invalid";
  if (!databaseId.safeParse(courseId).success) return "invalid";
  const { db } = getStudentRuntime();
  try {
    const schemas = { course: courseInput, video: videoInput };
    const values = parseOperation(schemas, operation, form);
    if (!values) return "invalid";
    if (!(await updateCourseContent(db, studentId, courseId, operation, values))) return "invalid";
  } catch (error) {
    console.error("Course content write failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}
