"use server";

import { revalidatePath } from "next/cache";
import { requireStudentSession } from "../../lib/student-auth/session";
import { adminUsername, isStudentAdmin } from "../../lib/student-progress";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { limitStudentAction } from "../../lib/student-auth/action-limit";
import { databaseId, parseForm } from "../../lib/validation/forms";
import {
  adminCourseInput,
  enrollmentInput,
  enrollmentStatusInput,
} from "../../lib/validation/admin";
import { progressInputs } from "../../lib/validation/progress";
import { videoInput } from "../../lib/validation/courses";
import { saveDefinitionContent, saveDefinitionVideo } from "../../lib/db/admin-course-content";
import { writeAdminCourse } from "../../lib/db/admin-courses";
import { studentPaths } from "../../lib/student-auth/paths";

export async function saveAdminCourse(definitionId, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id);
  if (limited) return limited;
  if (!databaseId.nullable().safeParse(definitionId).success) return "invalid";
  const values = parseForm(adminCourseInput, form);
  if (!values) return "invalid";
  try {
    if (!(await saveDefinitionContent(getStudentRuntime().db, definitionId, values)))
      return "invalid";
  } catch (error) {
    console.error("Course creation failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}

export async function saveAdminVideo(definitionId, videoId, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id);
  if (limited) return limited;
  if (
    !databaseId.safeParse(definitionId).success ||
    !databaseId.nullable().safeParse(videoId).success
  )
    return "invalid";
  const values = parseForm(videoInput, form);
  if (!values) return "invalid";
  try {
    if (!(await saveDefinitionVideo(getStudentRuntime().db, definitionId, videoId, values)))
      return "invalid";
  } catch (error) {
    console.error("Course video update failed", error.cause?.code ?? error.code);
    return "failed";
  }
  revalidatePath(studentPaths.dashboard, "layout");
  return "saved";
}

export async function updateAdminCourse(definitionId, operation, assignmentId, _previous, form) {
  const { user } = await requireStudentSession();
  if (!isStudentAdmin(user)) return "forbidden";
  const limited = await limitStudentAction(user.id);
  if (limited) return limited;
  if (
    !databaseId.safeParse(definitionId).success ||
    !databaseId.nullable().safeParse(assignmentId).success
  )
    return "invalid";
  const schema = {
    enroll: enrollmentInput,
    status: enrollmentStatusInput,
    grade: progressInputs.award,
  };
  if (!Object.hasOwn(schema, operation)) return "invalid";
  const values = parseForm(
    schema[operation],
    form,
    operation === "grade" ? { course: String(assignmentId), kind: "session" } : {},
  );
  if (!values) return "invalid";
  let status;
  try {
    status = await writeAdminCourse(
      getStudentRuntime().db,
      adminUsername(),
      definitionId,
      operation,
      assignmentId,
      values,
    );
  } catch (error) {
    console.error("Course roster update failed", error.cause?.code ?? error.code);
    return "failed";
  }
  if (status === "saved") revalidatePath(studentPaths.dashboard, "layout");
  return status;
}
