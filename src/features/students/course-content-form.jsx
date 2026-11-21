import { useSavedAction } from "./use-saved-action";
import { FormFeedback } from "./form-feedback";
import { DialogFormActions } from "./dialog-form-actions";
import { saveCourseContent } from "./course-actions";
import { CourseFormFields } from "./course-form-fields";
import { VideoFormFields } from "./video-form-fields";

export function CourseContentForm({ studentId, course, operation, labels, copy, onSaved }) {
  const [status, action, pending, formProps] = useSavedAction(
    saveCourseContent.bind(null, studentId, course.id, operation),
    onSaved,
  );

  return (
    <form {...formProps} className="student-panel__form student-course__form" action={action}>
      {course.sharedContent && <p className="student-course__wide-field">{labels.sharedHint}</p>}
      {operation === "course" ? (
        <CourseFormFields labels={labels} course={course} />
      ) : (
        <VideoFormFields labels={labels} />
      )}
      <DialogFormActions pending={pending} submitLabel={copy.save} />
      <FormFeedback status={status} copy={copy} hideSaved className="student-course__wide-field" />
    </form>
  );
}
