import { ProgressChart } from "./progress-chart";
import { ProgressCourses } from "./progress-courses";
import { DashboardGoals } from "./dashboard-goals";
import { dashboardCopy } from "./dashboard-copy";
import { currentStudentCourse } from "../../lib/student-current-course";
import { AccountNotice } from "./account-notice";

export function ProgressOverview({ progress, copy, locale, management, statisticsVisible = true }) {
  const course = currentStudentCourse(progress.courses);
  const labels = dashboardCopy[locale];
  return (
    <>
      <section className="student-progress__section" aria-label={copy.overview}>
        {statisticsVisible ? (
          <ProgressChart progress={progress} copy={copy} locale={locale} />
        ) : (
          <AccountNotice locale={locale} />
        )}
      </section>
      <div className="student-summary">
        <section className="student-summary__course" aria-label={labels.currentCourse}>
          {course ? (
            <ProgressCourses
              courses={[course]}
              copy={copy}
              locale={locale}
              statisticsVisible={statisticsVisible}
            />
          ) : (
            <div className="student-progress__card student-summary__empty-card">
              <p>{labels.noCurrentCourse}</p>
            </div>
          )}
        </section>
        <DashboardGoals
          goals={progress.goals}
          locale={locale}
          formCopy={copy}
          canCreate={!management}
        />
      </div>
    </>
  );
}
