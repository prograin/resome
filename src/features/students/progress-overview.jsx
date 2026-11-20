import { ProgressChart } from "./progress-chart";
import { ProgressCourses } from "./progress-courses";
import { DashboardGoals } from "./dashboard-goals";
import { dashboardCopy } from "./dashboard-copy";
import { currentStudentCourse } from "../../lib/student-current-course";

export function ProgressOverview({ progress, copy, locale, management }) {
  const course = currentStudentCourse(progress.courses);
  const labels = dashboardCopy[locale];
  const query = management?.selected
    ? `?student=${encodeURIComponent(management.selected.id)}`
    : "";
  return (
    <>
      <section className="student-progress__section" aria-label={copy.overview}>
        <ProgressChart progress={progress} copy={copy} locale={locale} />
      </section>
      <div className="student-summary">
        <section className="student-summary__course" aria-label={labels.currentCourse}>
          {course ? (
            <ProgressCourses courses={[course]} copy={copy} locale={locale} />
          ) : (
            <div className="student-progress__card student-summary__empty-card">
              <p>{labels.noCurrentCourse}</p>
            </div>
          )}
        </section>
        <DashboardGoals
          goals={progress.goals}
          locale={locale}
          query={query}
          formCopy={copy}
          canCreate={!management}
        />
      </div>
    </>
  );
}
