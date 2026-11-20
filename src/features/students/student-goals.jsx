import { useId, useState } from "react";
import { useDetailsDialog } from "../../components/details-dialog";
import { Icon } from "../../components/icon";
import { Button } from "../../components/ui/button";
import { goalCopy } from "./goal-copy";
import { GoalProgress } from "./goal-progress";
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

function GoalDescription({ description, labels }) {
  const descriptionId = useId();
  const [expanded, setExpanded] = useState(false);
  const preview = Array.from(description.split("\n").slice(0, 3).join("\n"))
    .slice(0, 160)
    .join("")
    .trimEnd();
  const truncated = preview !== description;

  return (
    <div className="student-goal__description-surface">
      <p id={descriptionId} className="student-goal__description" dir="auto">
        {truncated && !expanded ? `${preview}…` : description}
      </p>
      {truncated && (
        <button
          type="button"
          className="student-goal__description-toggle"
          aria-expanded={expanded}
          aria-controls={descriptionId}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? labels.less : labels.more}
        </button>
      )}
    </div>
  );
}

export function StudentGoals({ goals, management, copy, locale }) {
  const labels = goalCopy[locale];
  const percentages = new Intl.NumberFormat(locale, { style: "percent" });
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
              <div className="student-goal__heading">
                <div>
                  <h2>
                    <bdi>{goal.title.trim()}</bdi>
                  </h2>
                  <p className="student-goal__priority">
                    {labels.priority}{" "}
                    <span data-priority={goal.priority}>
                      {labels.priorities[goal.priority - 1]}
                    </span>
                  </p>
                </div>
                {!management && <GoalDialogButton goal={goal} copy={copy} locale={locale} />}
              </div>
              {goal.description && (
                <GoalDescription description={goal.description} labels={labels} />
              )}
              <GoalProgress
                label={management ? labels.student : labels.progress}
                value={goal.studentPercent}
                percentages={percentages}
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
