import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Select } from "../../components/ui/select";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { DialogFormActions } from "../students/dialog-form-actions";
import { studentAccountStatus, studentAccountStatuses } from "../../lib/student-account";
import { accountCopy } from "../students/account-copy";
import { setStudentActivity } from "./student-activity-actions";
import { adminCopy } from "./copy";

function AccountStatusForm({ student, locale, onSaved }) {
  const copy = accountCopy[locale];
  const initial = studentAccountStatus(student);
  const [selected, setSelected] = useState(initial);
  const [status, action, pending, formProps] = useSavedAction(
    setStudentActivity.bind(null, student.id),
    onSaved,
  );
  const description = {
    active: copy.activeDescription,
    inactive: copy.adminInactive,
    banned: copy.adminBanned,
  }[selected];
  return (
    <form {...formProps} action={action} className="student-panel__form">
      <label>
        {copy.title}
        <Select name="status" value={selected} onValueChange={setSelected} disabled={pending}>
          {studentAccountStatuses.map((value) => (
            <option key={value} value={value}>
              {copy[value]}
            </option>
          ))}
        </Select>
      </label>
      <p>{description}</p>
      <FormFeedback status={status} copy={adminCopy[locale]} hideSaved />
      <DialogFormActions
        pending={pending}
        submitLabel={copy.save}
        submitDisabled={selected === initial}
      />
    </form>
  );
}

export function StudentActivityButton({ student, locale }) {
  const { open, close } = useDetailsDialog();
  const copy = accountCopy[locale];
  return (
    <Button
      variant="soft"
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title: copy.title,
          kicker: student.name,
          content: <AccountStatusForm student={student} locale={locale} onSaved={close} />,
        })
      }
    >
      <Icon name="user-round" />
      {copy.action}
    </Button>
  );
}
