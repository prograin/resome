import { useActionState, useId, useRef } from "react";
import { useRouter } from "next/navigation";
import { studentAuth } from "../../lib/student-auth/client";
import { studentPaths } from "../../lib/student-auth/paths";
import { passwordChangeInput } from "../../lib/validation/password";
import { PasswordInput } from "../../components/ui/password-input";
import { Button } from "../../components/ui/button";
import { FormFeedback } from "./form-feedback";
import { passwordCopy } from "./password-copy";

export function ChangePassword({ locale }) {
  const copy = passwordCopy[locale];
  const router = useRouter();
  const { refetch } = studentAuth.useSession();
  const form = useRef(null);
  const feedbackId = useId();
  const [status, action, pending] = useActionState(async (_previous, fields) => {
    const parsed = passwordChangeInput.safeParse({
      currentPassword: fields.get("currentPassword"),
      newPassword: fields.get("newPassword"),
      confirmPassword: fields.get("confirmPassword"),
      revokeOtherSessions: true,
    });
    if (!parsed.success)
      return parsed.error.issues.some((issue) => issue.path[0] === "confirmPassword")
        ? "mismatch"
        : "invalid";
    try {
      const { error } = await studentAuth.changePassword(parsed.data);
      if (error?.status === 401) {
        router.replace(studentPaths.signIn);
        return "failed";
      }
      if (error?.status === 429) return "limit";
      if (error) return error.code === "INVALID_PASSWORD" ? "incorrect" : "failed";
      form.current?.reset();
      await refetch().catch(() => {});
      return "saved";
    } catch {
      return "failed";
    }
  }, null);
  return (
    <form
      ref={form}
      action={action}
      aria-label={copy.title}
      aria-busy={pending}
      className="student-password student-panel__form student-progress__card"
    >
      <fieldset disabled={pending} className="student-panel__fields">
        {[
          ["currentPassword", copy.current, "current-password"],
          ["newPassword", copy.next, "new-password"],
          ["confirmPassword", copy.confirm, "new-password"],
        ].map(([name, label, autoComplete]) => (
          <label key={name}>
            {label}
            <PasswordInput
              key={`${name}-${status === "saved"}`}
              name={name}
              autoComplete={autoComplete}
              copy={copy}
              aria-label={label}
              aria-describedby={status ? feedbackId : undefined}
            />
          </label>
        ))}
      </fieldset>
      <FormFeedback id={feedbackId} status={status} copy={copy} />
      <div className="student-profile__actions">
        <Button type="submit" variant="primary" disabled={pending}>
          {pending ? copy.pending : copy.submit}
        </Button>
      </div>
    </form>
  );
}
