import { Button } from "../../components/ui/button";
import { useSavedAction } from "../students/use-saved-action";
import { FormFeedback } from "../students/form-feedback";
import { DialogFormActions } from "../students/dialog-form-actions";
import { updateAdminCourse } from "./course-actions";

export function RosterForm({
  definitionId,
  operation,
  assignmentId = null,
  copy,
  children,
  label,
  className = "",
  hideSaved = false,
  onSaved,
  dialog = false,
  submitDisabled = false,
}) {
  const [status, action, pending, formProps] = useSavedAction(
    updateAdminCourse.bind(null, definitionId, operation, assignmentId),
    onSaved,
  );
  return (
    <form {...formProps} action={action} className={`student-panel__form ${className}`}>
      <fieldset
        className={dialog ? "academy-admin__enrollment-fields" : "academy-admin__roster-fields"}
        disabled={pending}
      >
        {typeof children === "function" ? children(pending) : children}
        {!dialog && (
          <Button type="submit" variant="soft" disabled={pending || submitDisabled}>
            {pending ? copy.pending : label}
          </Button>
        )}
      </fieldset>
      {dialog && (
        <DialogFormActions
          pending={pending}
          submitLabel={pending ? copy.pending : label}
          variant="soft"
          submitDisabled={submitDisabled}
        />
      )}
      <FormFeedback copy={copy} status={status} hideSaved={hideSaved} />
    </form>
  );
}
