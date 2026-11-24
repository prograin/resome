export function ScoreTodayTag({ recorded, copy }) {
  return recorded ? <span className="academy-admin__score-today">{copy.scoredToday}</span> : null;
}
