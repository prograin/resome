import { useDetailsDialog } from "../../components/details-dialog";
import { Icon } from "../../components/icon";
import { Button } from "../../components/ui/button";
import { goalCopy } from "./goal-copy";
import { GoalDetails } from "./goal-details";
import { GoalForm } from "./goal-form";

export function GoalDialogButton({ goal, copy, locale, text }) {
  const labels = goalCopy[locale];
  const { open, close } = useDetailsDialog();
  const label = goal ? labels.edit : labels.add;
  return (
    <Button
      variant="soft"
      className={goal ? "student-goal__action" : undefined}
      aria-label={text ?? label}
      title={text ?? label}
      aria-haspopup="dialog"
      onClick={() =>
        open({
          kind: "academy",
          title: label,
          kicker: goal?.title,
          content: (
            <GoalForm goal={goal} labels={labels} copy={copy} locale={locale} onSaved={close} />
          ),
        })
      }
    >
      <Icon name={goal ? "pencil" : "plus"} />
      {text && <span>{text}</span>}
    </Button>
  );
}

export function StudentGoals({ goals, management, copy, locale }) {
  const labels = goalCopy[locale];
  const studentId = management?.selected?.id ?? null;
  if (management && !studentId) return <p>{copy.noStudents}</p>;

  return (
    <>
      {goals.length ? (
        <ul className="student-progress__section">
          {goals.map((goal) => (
            <li
              key={goal.id}
              id={`goal-${goal.id}`}
              tabIndex={-1}
              className="student-progress__card student-progress__section"
            >
              <GoalDetails
                goal={goal}
                labels={labels}
                locale={locale}
                progressLabel={management ? labels.student : labels.progress}
                actions={
                  !management && <GoalDialogButton goal={goal} copy={copy} locale={locale} />
                }
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>{labels.empty}</p>
      )}
    </>
  );
}
