import { ProfileDetails } from "./profile-details";
import { ProfileEmail } from "./profile-email";
import { profileCopy } from "./profile-copy";
import { StudentSignOut } from "./student-sign-out";
import { Button } from "../../components/ui/button";
import { SiteLink } from "../../components/site-link";
import { Icon } from "../../components/icon";
import { studentPaths } from "../../lib/student-auth/paths";
import { passwordCopy } from "./password-copy";

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
      <div className="student-profile__actions">
        <Button as={SiteLink} href={studentPaths.password} variant="soft">
          <Icon name="lock" />
          {passwordCopy[locale].title}
        </Button>
      </div>
      <StudentSignOut copy={copy} />
    </div>
  );
}
