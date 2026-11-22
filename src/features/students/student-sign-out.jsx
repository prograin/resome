"use client";

import { useActionState, useId } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { studentPaths } from "../../lib/student-auth/paths";
import { studentAuth } from "../../lib/student-auth/client";
import { FormFeedback } from "./form-feedback";
import { clearBrowserPush } from "../notifications/browser-push";

export function StudentSignOut({ copy, description }) {
  const router = useRouter();
  const feedbackId = useId();
  const [status, signOut, pending] = useActionState(async () => {
    try {
      await clearBrowserPush().catch(() => {});
      const { error } = await studentAuth.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.replace(studentPaths.signIn);
            router.refresh();
          },
        },
      });
      return error ? "signOutFailed" : null;
    } catch {
      return "signOutFailed";
    }
  }, null);

  return (
    <form
      className={`student-panel__form student-profile__actions${description ? " student-profile__security-row" : ""}`}
      action={signOut}
      aria-busy={pending}
    >
      {description && <p>{description}</p>}
      <Button type="submit" disabled={pending} aria-describedby={status ? feedbackId : undefined}>
        {pending ? copy.pending : copy.signOut}
      </Button>
      <FormFeedback id={feedbackId} status={status} copy={copy} />
    </form>
  );
}
