import { useId, useState } from "react";
import { studentAuthPolicy } from "../../lib/student-auth/config";
import { ProfileForm } from "./profile-form";
import { formatGithubProfile } from "../../lib/github-profile";
import { profileLinkFields } from "../../lib/profile-links";

export function ProfileDetails({ profile, copy, admin }) {
  const hintId = useId();
  const initial = {
    firstName: profile.firstName ?? "",
    lastName: profile.lastName ?? "",
    ...Object.fromEntries(
      profileLinkFields.map(({ name }) => [
        name,
        name === "github" ? formatGithubProfile(profile.github) : (profile[name] ?? ""),
      ]),
    ),
    username: profile.username ?? "",
  };
  const [values, setValues] = useState(initial);
  const fields = [
    { name: "firstName", autoComplete: "given-name", maxLength: 80, readOnly: !admin },
    { name: "lastName", autoComplete: "family-name", maxLength: 80, readOnly: !admin },
    {
      name: "username",
      dir: "ltr",
      autoComplete: "username",
      minLength: studentAuthPolicy.username.min,
      maxLength: studentAuthPolicy.username.max,
      pattern: studentAuthPolicy.username.pattern.source,
      required: true,
      readOnly: admin,
      hint: admin ? copy.adminUsername : undefined,
    },
    ...profileLinkFields.map(({ name, maxLength, placeholder }) => ({
      name,
      maxLength,
      placeholder,
      type: "url",
      dir: "ltr",
    })),
  ];
  return (
    <ProfileForm
      operation="details"
      hideSaved
      title={copy.details}
      copy={copy}
      onEdit={() => setValues(initial)}
      onCancel={() => setValues(initial)}
    >
      {(editing) => (
        <>
          {fields.map(({ name, hint, ...attributes }) => (
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
          ))}
          {editing && <small className="student-profile__links-notice">{copy.linksShared}</small>}
        </>
      )}
    </ProfileForm>
  );
}
