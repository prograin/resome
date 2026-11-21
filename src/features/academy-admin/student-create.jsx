import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { useDetailsDialog } from "../../components/details-dialog";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { studentAuthPolicy } from "../../lib/student-auth/config";
import { createAcademyStudent } from "./actions";
import { DialogFormActions } from "../students/dialog-form-actions";

function StudentCreateForm({ copy, onSaved }) {
  const [status, action, pending, formProps] = useSavedAction(createAcademyStudent, onSaved);
  return (
    <form {...formProps} action={action} className="student-panel__form">
      <p>{copy.accountHint}</p>
      <fieldset className="academy-admin__fields" disabled={pending}>
        <label>
          {copy.firstName}
          <input name="firstName" autoComplete="given-name" required maxLength={80} />
        </label>
        <label>
          {copy.lastName}
          <input name="lastName" autoComplete="family-name" required maxLength={80} />
        </label>
        <label>
          {copy.username}
          <input
            name="username"
            dir="ltr"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            required
            minLength={studentAuthPolicy.username.min}
            maxLength={studentAuthPolicy.username.max}
            pattern={studentAuthPolicy.username.pattern.source}
          />
        </label>
        <label>
          {copy.password}
          <input
            name="password"
            type="password"
            dir="ltr"
            autoComplete="new-password"
            required
            minLength={studentAuthPolicy.password.min}
            maxLength={studentAuthPolicy.password.max}
          />
        </label>
      </fieldset>
      <FormFeedback copy={copy} status={status} />
      <DialogFormActions pending={pending} submitLabel={pending ? copy.pending : copy.create} />
    </form>
  );
}

export function StudentCreateButton({ copy }) {
  const { open, close } = useDetailsDialog();
  return (
    <Button
      variant="soft"
      dir="ltr"
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title: copy.add,
          content: <StudentCreateForm copy={copy} onSaved={close} />,
        })
      }
    >
      <Icon name="plus" />
      <span dir="auto">{copy.add}</span>
    </Button>
  );
}
