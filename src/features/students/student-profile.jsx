import { ProfileDetails } from "./profile-details";
import { ProfileEmail } from "./profile-email";
import { profileCopy } from "./profile-copy";
import { StudentSignOut } from "./student-sign-out";

export function StudentProfile({ profile, copy, locale, admin }) {
  return (
    <div className="student-profile student-progress__section">
      <ProfileDetails
        key={JSON.stringify([
          profile.firstName,
          profile.lastName,
          profile.username,
          profile.github,
          profile.telegram,
          profile.linkedin,
          profile.website,
        ])}
        profile={profile}
        copy={profileCopy[locale]}
        admin={admin}
      />
      <ProfileEmail profile={profile} copy={profileCopy[locale]} locale={locale} />
      <StudentSignOut copy={copy} />
    </div>
  );
}
