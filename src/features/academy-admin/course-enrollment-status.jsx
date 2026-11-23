import { enrollmentStatuses } from "../../lib/course-options";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { updateAdminCourse } from "./course-actions";
import { Select } from "../../components/ui/select";
import { startTransition } from "react";

export function CourseEnrollmentStatus({ student, definitionId, copy }) {
  const [status, action, pending, formProps] = useSavedAction(
    updateAdminCourse.bind(null, definitionId, "status", student.id),
  );
  return (
    <form
      {...formProps}
      action={action}
      className="student-panel__form academy-admin__status-control"
    >
      <Select
        name="status"
        value={student.status}
        disabled={pending}
        aria-label={`${copy.status}: ${student.fullName}`}
        data-enrollment-status={student.status}
        onValueChange={(value) => {
          const form = new FormData();
          form.set("status", value);
          startTransition(() => action(form));
        }}
      >
        {enrollmentStatuses.map((value) => (
          <option key={value} value={value}>
            {copy[value]}
          </option>
        ))}
      </Select>
      <FormFeedback status={status} copy={copy} hideSaved />
    </form>
  );
}
