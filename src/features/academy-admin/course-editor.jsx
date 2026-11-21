import { DialogFormActions } from "../students/dialog-form-actions";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { CourseFormFields } from "../students/course-form-fields";
import { VideoFormFields } from "../students/video-form-fields";
import { courseCopy } from "../students/course-copy";
import { saveAdminCourse, saveAdminVideo } from "./course-actions";

export function AdminCourseEditor({ course, copy, locale, onSaved }) {
  const [status, action, pending, formProps] = useSavedAction(
    saveAdminCourse.bind(null, course?.id ?? null),
    onSaved,
  );
  return (
    <form {...formProps} action={action} className="student-panel__form student-course__form">
      <fieldset className="student-course__wide-field academy-admin__fields" disabled={pending}>
        <CourseFormFields labels={courseCopy[locale]} course={course} />
      </fieldset>
      <FormFeedback copy={copy} status={status} className="student-course__wide-field" />
      <DialogFormActions
        pending={pending}
        variant="soft"
        submitLabel={pending ? copy.pending : copy.save}
      />
    </form>
  );
}

export function AdminVideoEditor({ definitionId, video, copy, locale, onSaved }) {
  const [status, action, pending, formProps] = useSavedAction(
    saveAdminVideo.bind(null, definitionId, video?.id ?? null),
    onSaved,
  );
  return (
    <form {...formProps} action={action} className="student-panel__form student-course__form">
      <p className="student-course__wide-field">{copy.sharedHint}</p>
      <fieldset className="student-course__wide-field academy-admin__fields" disabled={pending}>
        <VideoFormFields labels={courseCopy[locale]} video={video} />
      </fieldset>
      <FormFeedback copy={copy} status={status} className="student-course__wide-field" />
      <DialogFormActions
        pending={pending}
        variant="soft"
        submitLabel={pending ? copy.pending : copy.save}
      />
    </form>
  );
}
