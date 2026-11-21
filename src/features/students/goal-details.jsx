import { useId, useState } from "react";
import { GoalProgress } from "./goal-progress";

function GoalDescription({ description, labels, full }) {
  const descriptionId = useId();
  const [expanded, setExpanded] = useState(false);
  const preview = Array.from(description.split("\n").slice(0, 3).join("\n"))
    .slice(0, 160)
    .join("")
    .trimEnd();
  const truncated = !full && preview !== description;
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

export function GoalDetails({
  goal,
  labels,
  locale,
  actions,
  progressLabel,
  full = false,
  showTitle = true,
}) {
  return (
    <div className="student-progress__section">
      <div className="student-goal__heading">
        <div>
          {showTitle && (
            <h2>
              <bdi>{goal.title.trim()}</bdi>
            </h2>
          )}
          <p className="student-goal__priority">
            {labels.priority}{" "}
            <span data-priority={goal.priority}>{labels.priorities[goal.priority - 1]}</span>
          </p>
        </div>
        {actions}
      </div>
      {goal.description && (
        <GoalDescription description={goal.description} labels={labels} full={full} />
      )}
      <GoalProgress
        label={progressLabel ?? labels.progress}
        value={goal.studentPercent}
        percentages={new Intl.NumberFormat(locale, { style: "percent" })}
      />
    </div>
  );
}
