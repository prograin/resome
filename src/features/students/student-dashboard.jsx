"use client";

import { usePreferences } from "../../components/preferences";
import { Button } from "../../components/ui/button";
import { SiteLink } from "../../components/site-link";
import { studentPaths } from "../../lib/student-auth/paths";
import { studentCopy } from "./content";
import { progressCopy } from "./progress-copy";
import { ProgressOverview } from "./progress-overview";
import { ProgressChart } from "./progress-chart";
import { WeeklyUpdated } from "./weekly-updated";
import { ProgressHistory } from "./progress-history";
import { ProgressCourses } from "./progress-courses";
import { DashboardSidebar } from "./dashboard-sidebar";
import { StudentProfile } from "./student-profile";
import { GoalDialogButton, StudentGoals } from "./student-goals";
import { SessionGuard } from "./session-guard";
import { AcademyAdminOverview } from "../academy-admin/overview";
import { adminCopy } from "../academy-admin/copy";
import { adminCourseCopy } from "../academy-admin/course-copy";
import { AdminCourseCatalog } from "../academy-admin/course-catalog";
import { AdminCourseButton } from "../academy-admin/course-dialog-button";
import { StudentCreateButton } from "../academy-admin/student-create";
import { AdminCourseRoster } from "../academy-admin/course-roster";
import { CourseEnrollmentButton } from "../academy-admin/course-enrollment-button";
import { StudentManagementOverview } from "./student-management-overview";
import { StudentCourseEnrollmentButton } from "./student-course-enrollment";
import { StudentLinks } from "./student-links";
import { studentLinksCopy } from "./student-links-copy";
import { Icon } from "../../components/icon";

export function StudentDashboard({
  userId,
  username,
  profile,
  progress,
  management,
  view,
  directory,
  adminCourses,
  adminCourse,
  studentsLinks,
}) {
  const { locale, dir } = usePreferences();
  const copy = studentCopy[locale];
  const progressLabels = progressCopy[locale];
  const coursesView = view === "courses";
  const profileView = view === "profile";
  const title = {
    "admin-courses": adminCourseCopy[locale].title,
    "admin-directory": adminCopy[locale].students,
    "admin-grades": `${adminCourseCopy[locale].grades} · ${adminCourse?.definition.title ?? ""}`,
    "admin-students": `${adminCourseCopy[locale].manage} · ${adminCourse?.definition.title ?? ""}`,
    admin: adminCopy[locale].title,
    overview: management
      ? locale === "fa"
        ? "مدیریت شاگرد"
        : "Student management"
      : copy.dashboard,
    chart: progressLabels.chart,
    history: progressLabels.history,
    courses: progressLabels.courses,
    goals: progressLabels.goals,
    profile: copy.profile,
    links: studentLinksCopy[locale].title,
  }[view];
  const courses = progress?.courses ?? [];

  return (
    <SessionGuard userId={userId}>
      <div className="student-dashboard" dir={dir}>
        <DashboardSidebar
          copy={progressLabels}
          dir={dir}
          view={view}
          profileLabel={copy.profile}
          management={management}
          username={username}
        />
        <div className="student-dashboard__main" dir={dir}>
          <section
            className="student-panel student-progress"
            dir={dir}
            aria-labelledby="student-dashboard-title"
          >
            <header className="student-progress__header">
              <h1 id="student-dashboard-title">{title}</h1>
              <div className="student-progress__header-actions">
                {view === "links" && (
                  <Button as={SiteLink} href={studentPaths.profile} variant="soft">
                    {studentLinksCopy[locale].edit}
                    <Icon name="pencil" />
                  </Button>
                )}
                {view === "overview" && management?.selected && (
                  <StudentCourseEnrollmentButton
                    management={management}
                    courses={courses}
                    locale={locale}
                  />
                )}
                {view === "admin" && (
                  <Button as={SiteLink} href={studentPaths.adminCourses} variant="soft">
                    {adminCourseCopy[locale].title}
                  </Button>
                )}
                {view === "admin-directory" && <StudentCreateButton copy={adminCopy[locale]} />}
                {view === "admin-courses" && <AdminCourseButton locale={locale} />}
                {view === "admin-students" && (
                  <CourseEnrollmentButton course={adminCourse} locale={locale} />
                )}
                {progress && (view === "overview" || view === "chart") && (
                  <WeeklyUpdated stats={progress.weekly?.stats} locale={locale} />
                )}
                {view === "goals" && !management && (
                  <GoalDialogButton copy={progressLabels} locale={locale} />
                )}
              </div>
            </header>
            {view === "links" ? (
              <StudentLinks initialPage={studentsLinks} locale={locale} />
            ) : view === "admin-courses" ? (
              <AdminCourseCatalog courses={adminCourses} locale={locale} />
            ) : adminCourse ? (
              <AdminCourseRoster
                course={adminCourse}
                locale={locale}
                gradesOnly={view === "admin-grades"}
              />
            ) : view === "admin" || view === "admin-directory" ? (
              <AcademyAdminOverview
                directory={directory}
                locale={locale}
                studentsOnly={view === "admin-directory"}
              />
            ) : management?.selected && view === "overview" ? (
              <StudentManagementOverview
                management={management}
                progress={progress}
                copy={progressLabels}
                locale={locale}
              />
            ) : coursesView ? (
              <ProgressCourses courses={courses} copy={progressLabels} locale={locale} />
            ) : view === "chart" ? (
              <ProgressChart progress={progress} copy={progressLabels} locale={locale} />
            ) : view === "history" ? (
              <ProgressHistory history={progress?.history} copy={progressLabels} locale={locale} />
            ) : view === "goals" ? (
              <StudentGoals
                goals={progress?.goals ?? []}
                management={management}
                copy={progressLabels}
                locale={locale}
              />
            ) : profileView ? (
              <StudentProfile profile={profile} copy={copy} locale={locale} admin={!!management} />
            ) : (
              <>
                {progress && (
                  <ProgressOverview
                    progress={progress}
                    copy={progressLabels}
                    locale={locale}
                    management={management}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </SessionGuard>
  );
}
