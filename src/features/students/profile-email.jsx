import { useId, useState } from "react";
import { ProfileForm } from "./profile-form";

export function ProfileEmail({ profile, copy }) {
  const [email, setEmail] = useState(profile.email ?? "");
  const hintId = useId();
  return (
    <ProfileForm
      operation="email"
      title={copy.email}
      copy={copy}
      locked={Boolean(profile.email)}
      onEdit={() => setEmail(profile.email ?? "")}
      onCancel={() => setEmail(profile.email ?? "")}
    >
      {(editing) => (
        <label>
          {copy.email}
          <input
            name="email"
            type="email"
            dir="ltr"
            required
            maxLength={254}
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            aria-describedby={hintId}
            value={email}
            readOnly={!editing}
            onChange={(event) => setEmail(event.target.value)}
          />
          <small id={hintId}>{profile.email ? copy.emailLocked : copy.emailHint}</small>
        </label>
      )}
    </ProfileForm>
  );
}
