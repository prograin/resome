import { useId, useState } from "react";
import { studentAuthPolicy } from "../../lib/student-auth/config";
import { ProfileForm } from "./profile-form";

export function ProfileDetails({ profile, copy, admin }) {
  const hintId = useId();
  const initial = {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    github: profile.github ?? "",
    username: profile.username ?? "",
  };
  const [values, setValues] = useState(initial);
  const fields = [
    { name: "firstName", autoComplete: "given-name", maxLength: 80 },
    { name: "lastName", autoComplete: "family-name", maxLength: 80 },
    {
      name: "username",
      dir: "ltr",
      autoComplete: "username",
      minLength: studentAuthPolicy.username.min,
      maxLength: studentAuthPolicy.username.max,
      pattern: studentAuthPolicy.username.pattern.source,
      required: true,
      readOnly: admin,
      hint: admin ? copy.adminUsername : copy.usernameHint,
    },
    { name: "github", dir: "ltr", maxLength: 39, hint: copy.githubHint },
  ];
  return (
    <ProfileForm
      operation="details"
      title={copy.details}
      copy={copy}
      onEdit={() => setValues(initial)}
      onCancel={() => setValues(initial)}
    >
      {(editing) =>
        fields.map(({ name, hint, ...attributes }) => (
          <label key={name}>
            {copy[name]}
            <input
              {...attributes}
              readOnly={!editing || attributes.readOnly}
              name={name}
              value={values[name]}
              autoCapitalize={attributes.dir === "ltr" ? "none" : undefined}
              spellCheck={attributes.dir === "ltr" ? false : undefined}
              aria-describedby={hint ? `${hintId}-${name}` : undefined}
              onChange={(event) => setValues({ ...values, [name]: event.target.value })}
            />
            {hint && <small id={`${hintId}-${name}`}>{hint}</small>}
          </label>
        ))
      }
    </ProfileForm>
  );
}
