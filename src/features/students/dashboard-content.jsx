import { ChangePassword } from "./change-password";
import { AcademyAdminOverview } from "../academy-admin/overview";
import { AdminCourseCatalog } from "../academy-admin/course-catalog";
import { AdminCourseRoster } from "../academy-admin/course-roster";
import { NotificationInbox } from "../notifications/notification-inbox";
import { StudentLinks } from "./student-links";
import { StudentManagementOverview } from "./student-management-overview";
import { StudentProfile } from "./student-profile";
import { StudentGoals } from "./student-goals";
import { ProgressCourses } from "./progress-courses";
import { ProgressChart } from "./progress-chart";
import { ProgressHistory } from "./progress-history";
import { ProgressOverview } from "./progress-overview";
import { AccountNotice } from "./account-notice";

export function DashboardContent({
  userId,
  view,
  progress,
  management,
  directory,
  adminCourses,
  adminCourse,
  studentsLinks,
  profile,
  copy,
  progressLabels,
  locale,
  statisticsVisible = true,
}) {
  if (!statisticsVisible && view === "chart") return <AccountNotice locale={locale} />;
  if (view === "notifications") return <NotificationInbox userId={userId} locale={locale} />;
  if (view === "links") return <StudentLinks initialPage={studentsLinks} locale={locale} />;
  if (view === "admin-courses")
    return <AdminCourseCatalog courses={adminCourses} locale={locale} />;
  if (adminCourse)
    return (
      <AdminCourseRoster
        course={adminCourse}
        locale={locale}
        gradesOnly={view === "admin-grades"}
      />
    );
  if (view === "admin" || view === "admin-directory")
    return (
      <AcademyAdminOverview
        directory={directory}
        locale={locale}
        studentsOnly={view === "admin-directory"}
      />
    );
  if (management?.selected && view === "overview")
    return (
      <StudentManagementOverview
        management={management}
        progress={progress}
        copy={progressLabels}
        locale={locale}
      />
    );
  switch (view) {
    case "password":
      return <ChangePassword locale={locale} />;
    case "courses":
      return (
        <ProgressCourses
          courses={progress?.courses ?? []}
          copy={progressLabels}
          locale={locale}
          statisticsVisible={statisticsVisible}
        />
      );
    case "chart":
      return <ProgressChart progress={progress} copy={progressLabels} locale={locale} />;
    case "history":
      return <ProgressHistory history={progress?.history} copy={progressLabels} locale={locale} />;
    case "goals":
      return (
        <StudentGoals
          goals={progress?.goals ?? []}
          management={management}
          copy={progressLabels}
          locale={locale}
        />
      );
    case "profile":
      return <StudentProfile profile={profile} copy={copy} locale={locale} admin={!!management} />;
    default:
      return progress ? (
        <ProgressOverview
          progress={progress}
          copy={progressLabels}
          locale={locale}
          management={management}
          statisticsVisible={statisticsVisible}
        />
      ) : null;
  }
}
