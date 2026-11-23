import { z } from "zod";
import { signInInput } from "./sign-in.js";
import { studentIdInput } from "./forms.js";
import { courseInput } from "./courses.js";
import { enrollmentStatuses, maximumEnrollmentBatch } from "../course-options.js";

export const createStudentInput = signInInput
  .omit({ rememberMe: true })
  .extend({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
  })
  .strip();

export const adminCourseInput = courseInput;
export const enrollmentInput = z.object({ studentId: studentIdInput });
export const enrollmentStudentIdsInput = z
  .array(studentIdInput)
  .min(1)
  .max(maximumEnrollmentBatch)
  .refine((ids) => new Set(ids).size === ids.length);
export const enrollmentBatchInput = z.object({
  studentIds: z
    .string()
    .max(14000)
    .transform((value, context) => {
      try {
        return JSON.parse(value);
      } catch {
        context.addIssue({ code: "custom", message: "Invalid student selection" });
        return z.NEVER;
      }
    })
    .pipe(enrollmentStudentIdsInput),
});
export const enrollmentStatusInput = z.object({ status: z.enum(enrollmentStatuses) });

export const studentDirectoryInput = z.object({
  q: z.string().trim().max(80).catch(""),
  page: z.coerce.number().int().min(1).max(100000).catch(1),
  sort: z.enum(["created", "name", "username", "courseCount", "average", "rank"]).catch("created"),
  direction: z.enum(["asc", "desc"]).catch("desc"),
});
