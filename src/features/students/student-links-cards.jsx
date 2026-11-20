import { Button } from "../../components/ui/button";
import { Icon } from "../../components/icon";
import { profileLinkFields } from "../../lib/profile-links";
import { profileCopy } from "./profile-copy";
import { studentLinksCopy } from "./student-links-copy";

export function StudentLinksCards({ students = [], locale }) {
  const copy = studentLinksCopy[locale];
  const labels = profileCopy[locale];
  if (!students.length) return <p>{copy.empty}</p>;
  return (
    <ul className="student-links__grid" aria-label={copy.title}>
      {students.map((student) => {
        const links = profileLinkFields.filter(({ name }) => student[name]);
        return (
          <li key={student.username} className="student-progress__card student-links__card">
            <header className="student-links__identity">
              <Icon name="user-round" />
              <h2>
                <bdi>{student.username}</bdi>
              </h2>
            </header>
            {links.length ? (
              <div className="student-links__actions">
                {links.map(({ name, icon }) => (
                  <Button
                    as="a"
                    key={name}
                    href={student[name]}
                    variant="soft"
                    target="_blank"
                    rel="noopener noreferrer ugc"
                    aria-label={`${labels[name]} · ${student.username}`}
                  >
                    <Icon name={icon} />
                    <span>{labels[name]}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <p>{copy.noLinks}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
