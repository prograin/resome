import { Select } from "../../components/ui/select";
import { useSavedAction } from "./use-saved-action";
import { FormFeedback } from "./form-feedback";
import { Button } from "../../components/ui/button";
import { updateProgress } from "./progress-actions";

function CourseSelect({ courses, copy, optional = false }) {
  return (
    <label>
      {copy.course}
      <Select name="course" required={!optional}>
        {optional && <option value="">{copy.general}</option>}
        {courses.map(({ id, title }) => (
          <option key={id} value={id}>
            {title}
          </option>
        ))}
      </Select>
    </label>
  );
}

export function ProgressManagement({ management, courses, copy }) {
  const studentId = management.selected?.id;
  const [status, action, pending, formProps] = useSavedAction(
    updateProgress.bind(null, studentId, "award"),
  );
  if (!studentId) return <p>{copy.noStudents}</p>;
  return (
    <form
      {...formProps}
      className="student-panel__form student-progress__card student-management__award"
      action={action}
      aria-labelledby="progress-admin-title"
    >
      <h3 id="progress-admin-title">{copy.award}</h3>
      <div className="student-management__award-fields">
        <CourseSelect courses={courses} copy={copy} optional />
        <label>
          {copy.points}
          <input name="points" type="number" required min={1} max={5} step={1} />
        </label>
        <label>
          {copy.reason}
          <Select name="kind">
            {Object.entries(copy.kinds).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" variant="primary" disabled={pending}>
          {copy.save}
        </Button>
      </div>
      <label>
        {copy.note}
        <textarea name="note" rows={2} maxLength={500} />
      </label>
      <FormFeedback status={status} copy={copy} />
    </form>
  );
}
