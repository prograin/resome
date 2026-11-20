import { weeklyBaseline } from "../../lib/scoring/weekly-baseline";
import { rankingPolicy } from "../../lib/scoring/policy";
import { weeklyChange } from "./weekly-copy";
import { WeeklyChange } from "./weekly-change";
import { currentStudentCourse } from "../../lib/student-current-course";

export function ProgressMetrics({ progress, copy, locale }) {
  const stats = weeklyBaseline(progress.weekly?.stats);
  const course = currentStudentCourse(progress.courses);
  const courseSnapshot = stats?.courseId === course?.id ? stats : null;
  const metrics = [
    {
      label: copy.average,
      value: progress.score?.average,
      previous: stats?.average,
      kind: "average",
    },
    {
      label: copy.courseRank,
      value: course?.rank,
      previous: courseSnapshot?.courseRank,
      kind: "rank",
    },
    {
      label: copy.rank,
      value: progress.score?.rank,
      previous: stats?.overallRank,
      kind: "rank",
    },
    {
      label: copy.assessments,
      value: progress.score?.assessments ?? 0,
      previous: stats?.assessments,
      kind: "count",
    },
  ];
  const numbers = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const penalty = Number(progress.score?.inactivityPenalty ?? 0);
  return (
    <div className="student-chart__metrics">
      {metrics.map(({ label, value, previous, kind }) => {
        const change = weeklyChange(value, previous, kind, locale);
        return (
          <div
            key={label}
            className="student-progress__card student-chart__average"
            style={
              kind === "average" && value != null
                ? {
                    "--student-average-color": `var(--academy-score-${Math.max(1, Math.min(5, Math.round(Number(value))))})`,
                  }
                : undefined
            }
          >
            <p>
              {label}{" "}
              {label === copy.rank &&
                (progress.score?.courseCount ?? 0) < rankingPolicy.minimumCourses && (
                  <small>
                    {". "}
                    {locale === "fa"
                      ? "ورود به رتبه‌بندی از دورهٔ دوم"
                      : "Overall ranking starts with your second course"}
                  </small>
                )}
            </p>
            <bdi className="student-chart__average-value">
              {value == null ? "—" : numbers.format(Number(value))}
            </bdi>
            <WeeklyChange change={change} />
            {kind === "average" && penalty > 0 && (
              <small>
                {locale === "fa"
                  ? `میانگین خام: ${numbers.format(Number(progress.score.rawAverage))}؛ کسر عدم فعالیت: ${numbers.format(penalty)}`
                  : `Raw average: ${numbers.format(Number(progress.score.rawAverage))}; inactivity deduction: ${numbers.format(penalty)}`}
              </small>
            )}
          </div>
        );
      })}
    </div>
  );
}
