import { weeklyCopy } from "./weekly-copy";

export function WeeklyUpdated({ stats, locale }) {
  if (!stats) return null;
  const labels = weeklyCopy[locale];
  return (
    <p className="student-progress__updated">
      {labels.updated}:{" "}
      <time dateTime={new Date(stats.recordedAt).toISOString()}>
        {new Intl.DateTimeFormat(locale, {
          dateStyle: "medium",
          timeZone: "Asia/Tehran",
        }).format(new Date(stats.recordedAt))}
      </time>
    </p>
  );
}
