"use client";

import { useActionState, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { usePreferences } from "../../components/preferences";
import { studentPaths } from "../../lib/student-auth/paths";
import { studentAuth } from "../../lib/student-auth/client";
import { studentCopy } from "./content";
import { studentAuthPolicy } from "../../lib/student-auth/config";
import { FormFeedback } from "./form-feedback";
import { signInInput } from "../../lib/validation/sign-in";

export function StudentLogin() {
  const { locale, dir } = usePreferences();
  const copy = studentCopy[locale];
  const router = useRouter();
  const { refetch } = studentAuth.useSession();
  const feedbackId = useId();
  const [username, setUsername] = useState("");
  const [status, signIn, pending] = useActionState(async (_previous, fields) => {
    const parsed = signInInput.safeParse({
      username: fields.get("username"),
      password: fields.get("password"),
    });
    if (!parsed.success) return "invalid";
    try {
      const { error } = await studentAuth.signIn.username({
        ...parsed.data,
        fetchOptions: {
          onSuccess: async () => {
            await refetch();
            router.replace(studentPaths.dashboard);
            router.refresh();
          },
        },
      });
      if (error?.status === 429) return "limit";
      if (error) return [400, 401].includes(error.status) ? "invalid" : "unavailable";
      return null;
    } catch {
      return "unavailable";
    }
  }, null);

  return (
    <div className="student-login">
      <section
        className="student-panel academy-neo"
        dir={dir}
        aria-labelledby="student-login-title"
      >
        <h1 id="student-login-title">{copy.signIn}</h1>
        <form action={signIn} className="student-panel__form" aria-busy={pending}>
          <fieldset
            className="student-panel__fields"
            disabled={pending}
            aria-labelledby="student-login-title"
          >
            <label>
              {copy.username}
              <input
                name="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                autoCapitalize="none"
                spellCheck={false}
                dir="ltr"
                required
                minLength={studentAuthPolicy.username.min}
                maxLength={studentAuthPolicy.username.max}
                pattern={studentAuthPolicy.username.pattern.source}
                aria-invalid={status === "invalid" || undefined}
                aria-describedby={status ? feedbackId : undefined}
              />
            </label>
            <label>
              {copy.password}
              <input
                name="password"
                type="password"
                dir="ltr"
                autoComplete="current-password"
                required
                minLength={studentAuthPolicy.password.min}
                maxLength={studentAuthPolicy.password.max}
                aria-invalid={status === "invalid" || undefined}
                aria-describedby={status ? feedbackId : undefined}
              />
            </label>
          </fieldset>
          <FormFeedback id={feedbackId} status={status} copy={copy} />
          <Button type="submit" variant="primary" disabled={pending}>
            {pending ? copy.pending : copy.submit}
          </Button>
        </form>
      </section>
    </div>
  );
}
