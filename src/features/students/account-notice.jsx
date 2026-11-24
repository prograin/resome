import { Button } from "../../components/ui/button";
import { SiteLink } from "../../components/site-link";
import { contact } from "../../config/site";
import { studentPaths } from "../../lib/student-auth/paths";
import { accountCopy } from "./account-copy";
import { studentAuth } from "../../lib/student-auth/client";

export function AccountNotice({ locale, status = "inactive", id }) {
  const copy = accountCopy[locale];
  const { data } = studentAuth.useSession();
  return (
    <section
      id={id}
      className="student-progress__card student-progress__section"
      role={status === "banned" ? "alert" : "status"}
      data-account-notice={status}
    >
      {status === "inactive" && data?.user.academyInactiveReason === "no-score-60-days" && (
        <p>{copy.autoInactive}</p>
      )}
      <p>{copy[`${status}Description`]}</p>
      <div className="student-profile__actions">
        {status === "inactive" && (
          <Button as={SiteLink} href={studentPaths.history} variant="soft">
            {copy.history}
          </Button>
        )}
        <Button
          as={SiteLink}
          href={`https://t.me/${contact.telegram}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="soft"
        >
          {copy.support}
        </Button>
      </div>
    </section>
  );
}
