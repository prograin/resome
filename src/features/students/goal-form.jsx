import { Select } from "../../components/ui/select";
import { useId, useState } from "react";
import { DialogFormActions } from "./dialog-form-actions";
import { updateGoal } from "./goal-actions";
import { FormFeedback } from "./form-feedback";
import { useSavedAction } from "./use-saved-action";

export function GoalForm({ goal, labels, copy, locale, onSaved }) {
  const sliderId = useId();
  const [percent, setPercent] = useState(goal?.studentPercent ?? 0);
  const formattedPercent = new Intl.NumberFormat(locale, { style: "percent" }).format(
    percent / 100,
  );
  const [status, action, pending, formProps] = useSavedAction(
    updateGoal.bind(null, goal?.id ?? null),
    onSaved,
  );

  return (
    <form
      {...formProps}
      className="student-panel__form student-goal__form"
      data-add={!goal}
      action={action}
    >
      <div className="student-goal__title-field">
        <label>
          {labels.title}
          <input name="title" required maxLength={160} defaultValue={goal?.title} />
        </label>
      </div>
      <div className="student-goal__priority-field">
        <label>
          {labels.priority}
          <Select name="priority" defaultValue={goal?.priority ?? 2}>
            {labels.priorities.map((label, index) => (
              <option key={label} value={index + 1}>
                {label}
              </option>
            ))}
          </Select>
        </label>
      </div>
      {goal && (
        <div className="student-goal__slider">
          <label className="student-goal__slider-label" htmlFor={sliderId}>
            {labels.progress}
            <bdi aria-hidden="true">{formattedPercent}</bdi>
          </label>
          <div className="student-goal__range-surface academy-inset">
            <input
              id={sliderId}
              className="student-goal__range"
              name="percent"
              type="range"
              min={0}
              max={100}
              step={1}
              value={percent}
              style={{ "--goal-slider-fill": `${percent}%` }}
              aria-valuetext={formattedPercent}
              onChange={(event) => setPercent(event.target.valueAsNumber)}
            />
          </div>
        </div>
      )}
      <div className="student-goal__description-field">
        <label>
          {labels.description}
          <textarea
            name="description"
            rows={goal ? 2 : 5}
            maxLength={1000}
            dir="auto"
            defaultValue={goal?.description}
          />
        </label>
      </div>
      <DialogFormActions pending={pending} submitLabel={goal ? copy.save : labels.add} />
      <FormFeedback status={status} copy={copy} />
    </form>
  );
}
