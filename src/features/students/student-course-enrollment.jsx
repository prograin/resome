import { Select } from "../../components/ui/select";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { updateAdminCourse } from "../academy-admin/course-actions";
import { adminCourseCopy } from "../academy-admin/course-copy";
import { useSavedAction } from "./use-saved-action";
import { FormFeedback } from "./form-feedback";
import { DialogFormActions } from "./dialog-form-actions";
import { useDetailsDialog } from "../../components/details-dialog";
import { Icon } from "../../components/icon";

function StudentCourseEnrollment({ studentId, definitions, courses, locale, title, onSaved }) {
  const available = definitions.filter(
    (definition) => !courses.some((course) => course.definitionId === definition.id),
  );
  const [definitionId, setDefinitionId] = useState("");
  const selectedId = available.some((definition) => String(definition.id) === definitionId)
    ? definitionId
    : "";
  const [status, action, pending, formProps] = useSavedAction(
    updateAdminCourse.bind(null, Number(selectedId), "enroll", null),
    onSaved,
  );
  const copy = adminCourseCopy[locale];
  return (
    <form {...formProps} className="student-panel__form" action={action}>
      <input type="hidden" name="studentId" value={studentId} />
      {available.length ? (
        <>
          <label>
            {locale === "fa" ? "انتخاب دوره" : "Choose a course"}
            <Select name="definitionId" required value={selectedId} onValueChange={setDefinitionId}>
              <option value="" disabled>
                {locale === "fa" ? "یک دوره انتخاب کنید" : "Select a course"}
              </option>
              {available.map((definition) => (
                <option key={definition.id} value={definition.id}>
                  {definition.title}
                </option>
              ))}
            </Select>
          </label>
        </>
      ) : (
        <p>
          {locale === "fa"
            ? "دورهٔ جدیدی برای افزودن وجود ندارد."
            : "No additional courses are available."}
        </p>
      )}
      <FormFeedback status={status} copy={copy} />
      <DialogFormActions
        pending={pending}
        submitDisabled={!selectedId}
        submitLabel={pending ? copy.pending : title}
      />
    </form>
  );
}

export function StudentCourseEnrollmentButton({ management, courses, locale }) {
  const { open, close } = useDetailsDialog();
  const title = locale === "fa" ? "افزودن به دوره" : "Enroll in a course";
  return (
    <Button
      variant="soft"
      dir="ltr"
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title,
          kicker: management.selected.name,
          content: (
            <StudentCourseEnrollment
              studentId={management.selected.id}
              definitions={management.definitions ?? []}
              courses={courses}
              locale={locale}
              title={title}
              onSaved={close}
            />
          ),
        })
      }
    >
      <Icon name="plus" />
      <span dir="auto">{locale === "fa" ? "دوره" : "Course"}</span>
    </Button>
  );
}
