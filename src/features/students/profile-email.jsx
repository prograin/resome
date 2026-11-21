import { useId, useState } from "react";
import { ProfileForm } from "./profile-form";
import { saveProfileEmail } from "./profile-email-actions";
import { useEmailCooldown } from "./use-email-cooldown";
import { FormFeedback } from "./form-feedback";

export function ProfileEmail({ profile, copy, locale }) {
  const cooldown = useEmailCooldown();
  const digits = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false });
  const countdown = cooldown.remaining > 0 && (
    <bdi>
      {digits.format(Math.floor(cooldown.remaining / 60))}:{digits.format(cooldown.remaining % 60)}
    </bdi>
  );
  const [email, setEmail] = useState(profile.email ?? "");
  const [savedEmail, setSavedEmail] = useState("");
  const registeredEmail = profile.email || savedEmail;
  const [sent, setSent] = useState(false);
  const [otp, setOTP] = useState("");
  const hintId = useId();
  const reset = () => {
    setEmail(profile.email ?? "");
    setSent(false);
    setOTP("");
  };
  return (
    <ProfileForm
      operation={sent ? "verify" : "send"}
      title={copy.email}
      copy={{ ...copy, saved: copy.emailSaved }}
      locked={Boolean(registeredEmail)}
      clearOnLeave
      inlineFeedback={sent}
      onEdit={reset}
      onCancel={reset}
      submitLabel={
        sent ? (
          copy.verifyEmail
        ) : (
          <>
            {copy.sendCode} {countdown}
          </>
        )
      }
      submitDisabled={!sent && cooldown.remaining > 0}
      onSubmit={(operation, previous, form) =>
        saveProfileEmail(form.get("intent") === "resend" ? "send" : operation, previous, form)
      }
      onResult={(result) => {
        if (result === "sent") {
          cooldown.start();
          setSent(true);
          setOTP("");
        }
        if (result === "saved") {
          setSavedEmail(email.trim().toLowerCase());
          setSent(false);
          setOTP("");
        }
        if (result === "emailLimit" && !cooldown.remaining) cooldown.start();
      }}
    >
      {(editing, status) => (
        <>
          <div className="student-profile__email-field">
            <div className="student-profile__field-heading">
              <label htmlFor={`${hintId}-email`}>{copy.email}</label>
            </div>
            <input
              id={`${hintId}-email`}
              name="email"
              type="email"
              dir="ltr"
              required
              maxLength={254}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              aria-describedby={sent || registeredEmail ? undefined : hintId}
              value={registeredEmail || email}
              disabled={Boolean(registeredEmail)}
              readOnly={!editing || sent}
              onChange={(event) => setEmail(event.target.value)}
            />
            {!sent && !registeredEmail && <small id={hintId}>{copy.emailHint}</small>}
          </div>
          {editing && sent && (
            <div className="student-profile__verification">
              <div className="student-profile__field-heading">
                <label htmlFor={`${hintId}-otp`}>{copy.verificationCode}</label>
                <button
                  className="student-profile__resend"
                  type="submit"
                  name="intent"
                  value="resend"
                  formNoValidate
                  disabled={cooldown.remaining > 0}
                >
                  {copy.resendCode} {countdown}
                </button>
              </div>
              <input
                id={`${hintId}-otp`}
                name="otp"
                dir="ltr"
                inputMode="numeric"
                autoComplete="one-time-code"
                aria-describedby={`${hintId}-code`}
                aria-invalid={Boolean(status && status !== "saved") || undefined}
                pattern="[0-9۰-۹٠-٩]{4}"
                minLength={4}
                maxLength={4}
                required
                value={otp}
                onChange={(event) => setOTP(event.target.value)}
              />
              {status && status !== "saved" ? (
                <FormFeedback id={`${hintId}-code`} status={status} copy={copy} />
              ) : (
                <small id={`${hintId}-code`} role="status">
                  {copy.codeHint}
                </small>
              )}
            </div>
          )}
        </>
      )}
    </ProfileForm>
  );
}
