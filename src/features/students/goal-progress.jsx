export function GoalProgress({ label, value, percentages, compact = false }) {
  const formatted = percentages.format(value / 100);
  return (
    <div className={compact ? "student-goal-progress--compact" : undefined}>
      <p className="student-goal__slider-label">
        {!compact && <span>{label}:</span>}{" "}
        <bdi className="student-goal__progress-value">{formatted}</bdi>
      </p>
      <div
        className="student-goal__range-surface academy-inset"
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuetext={formatted}
      >
        <input
          className="student-goal__range"
          type="range"
          min={0}
          max={100}
          value={value}
          style={{ "--goal-slider-fill": `${value}%` }}
          disabled
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
