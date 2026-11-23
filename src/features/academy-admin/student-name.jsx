import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { DialogFormActions } from "../students/dialog-form-actions";
import { StudentNameFields } from "./student-name-fields";
import { updateStudentName } from "./student-name-actions";
import { adminCopy } from "./copy";

function StudentNameForm({ student, copy, onSaved, save }) {
  const [status, action, pending, formProps] = useSavedAction(
    updateStudentName.bind(null, student.id),
    onSaved,
  );
  return (
    <form {...formProps} action={action} className="student-panel__form">
      <fieldset className="academy-admin__fields" disabled={pending}>
        <StudentNameFields copy={copy} student={student} />
      </fieldset>
      <FormFeedback copy={copy} status={status} />
      <DialogFormActions pending={pending} submitLabel={pending ? copy.pending : save} />
    </form>
  );
}

export function StudentNameButton({ student, locale }) {
  const { open, close } = useDetailsDialog();
  const title = locale === "fa" ? "ویرایش نام شاگرد" : "Edit student name";
  return (
    <Button
      variant="soft"
      aria-label={title}
      title={title}
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title,
          content: (
            <StudentNameForm
              student={student}
              copy={adminCopy[locale]}
              onSaved={close}
              save={locale === "fa" ? "ذخیرهٔ تغییرات" : "Save changes"}
            />
          ),
        })
      }
    >
      <Icon name="pencil" />
    </Button>
  );
}
