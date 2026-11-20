import { z } from "zod";
import { awardKinds, enrollmentStatuses } from "../course-options.js";
import { courseInput } from "./courses.js";
import { formId, formInteger, optionalText } from "./forms.js";

export const progressInputs = {
  course: courseInput
    .extend({
      definitionId: z.preprocess(
        (value) => (value === "" || value == null ? null : value),
        formId.nullable(),
      ),
    })
    .transform(({ definitionId, ...course }) => ({ definitionId, course })),
  status: z
    .object({ course: formId, status: z.enum(enrollmentStatuses) })
    .transform(({ course, status }) => ({ courseId: course, status })),
  award: z
    .object({
      course: z.preprocess(
        (value) => (value === "" || value == null ? null : value),
        formId.nullable(),
      ),
      points: formInteger(1, 5),
      kind: z.enum(awardKinds),
      note: optionalText(500),
    })
    .transform(({ course, ...values }) => ({ courseId: course, ...values })),
};
