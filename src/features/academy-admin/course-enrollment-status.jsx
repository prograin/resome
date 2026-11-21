import { enrollmentStatuses } from "../../lib/course-options";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { updateAdminCourse } from "./course-actions";

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
      <select
        name="status"
        value={student.status}
        disabled={pending}
        aria-label={`${copy.status}: ${student.fullName}`}
        data-enrollment-status={student.status}
        onChange={(event) => event.currentTarget.form.requestSubmit()}
      >
        {enrollmentStatuses.map((value) => (
          <option key={value} value={value}>
            {copy[value]}
          </option>
        ))}
      </select>
      <FormFeedback status={status} copy={copy} hideSaved />
    </form>
  );
}
