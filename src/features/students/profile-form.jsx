import { useActionState, useEffect, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { studentAuth } from "../../lib/student-auth/client";
import { saveStudentProfile } from "./profile-actions";
import { FormFeedback } from "./form-feedback";
import { Icon } from "../../components/icon";
import { submitFormAction } from "./submit-form-action";

export function ProfileForm({
  operation,
  title,
  copy,
  children,
  onEdit,
  onCancel,
  onSubmit = saveStudentProfile,
  onResult,
  submitLabel,
  submitDisabled = false,
  clearOnLeave = false,
  hideSaved = false,
  inlineFeedback = false,
  locked = false,
}) {
  const titleId = useId();
  const router = useRouter();
  const { refetch } = studentAuth.useSession();
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);
  useEffect(
    () => () => {
      if (clearOnLeave) setStatus(null);
    },
    [clearOnLeave],
  );
  const [, action, pending] = useActionState(async (_previous, form) => {
    if (!editing || locked || submitDisabled) return null;
    const result = await submitFormAction(
      onSubmit,
      [operation, null, form],
      operation === "details" ? "failed" : "emailFailed",
    );
    setStatus(result === "sent" ? null : result);
    onResult?.(result);
    if (result === "saved" || result === "emailLocked") {
      setEditing(false);
      await refetch().catch(() => {});
      router.refresh();
    }
    return null;
  }, null);
  return (
    <form
      className="student-panel__form student-progress__card student-profile__form"
      action={action}
      aria-labelledby={titleId}
      aria-busy={pending}
    >
      <div className="student-progress__header">
        <h2 id={titleId}>{title}</h2>
        {!editing && !locked && (
          <Button
            variant="soft"
            aria-label={`${copy.edit} ${title}`}
            title={`${copy.edit} ${title}`}
            onClick={() => {
              setStatus(null);
              onEdit?.();
              setEditing(true);
            }}
          >
            <Icon name="pencil" />
          </Button>
        )}
      </div>
      <fieldset
        disabled={!editing || locked || pending}
        className="student-profile__fields"
        aria-labelledby={titleId}
      >
        {children(editing && !locked, status)}
      </fieldset>
      {!(inlineFeedback && editing && !locked && status !== "saved") && (
        <FormFeedback status={status} copy={copy} hideSaved={hideSaved} />
      )}
      {editing && !locked && (
        <div className="student-profile__actions">
          <Button type="submit" variant="primary" disabled={pending || submitDisabled}>
            {pending ? copy.pending : (submitLabel ?? copy.save)}
          </Button>
          <Button
            variant="soft"
            disabled={pending}
            onClick={() => {
              onCancel?.();
              setStatus(null);
              setEditing(false);
            }}
          >
            {copy.cancel}
          </Button>
        </div>
      )}
    </form>
  );
}
