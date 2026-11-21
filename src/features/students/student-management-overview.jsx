import { SiteLink } from "../../components/site-link";
import { Button } from "../../components/ui/button";
import { studentPaths } from "../../lib/student-auth/paths";
import { ProgressMetrics } from "./progress-metrics";
import { ProgressManagement } from "./progress-management";
import { DashboardGoals } from "./dashboard-goals";

export function StudentManagementOverview({ management, progress, copy, locale }) {
  const query = `?student=${encodeURIComponent(management.selected.id)}`;
  return (
    <div className="student-progress__section">
      <ProgressMetrics progress={progress ?? {}} copy={copy} locale={locale} />
      <div className="student-management__row" key={management.selected.id}>
        <section
          className="student-progress__section student-progress__card student-management__goals"
          aria-label={copy.goals}
        >
          <div className="student-progress__header">
            <h2>{copy.goals}</h2>
            <Button as={SiteLink} href={studentPaths.goals + query} variant="soft">
              {locale === "fa" ? "دیدن همهٔ هدف‌ها" : "View all goals"}
            </Button>
          </div>
          <DashboardGoals
            goals={progress?.goals}
            locale={locale}
            formCopy={copy}
            canCreate={false}
            limit={3}
            embedded
          />
        </section>
        <ProgressManagement
          management={management}
          courses={progress?.courses ?? []}
          copy={copy}
          key={management.selected.id}
        />
      </div>
    </div>
  );
}
