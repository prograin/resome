"use client";

import { DashboardContent } from "./dashboard-content";
import { usePreferences } from "../../components/preferences";
import { Button } from "../../components/ui/button";
import { SiteLink } from "../../components/site-link";
import { studentPaths } from "../../lib/student-auth/paths";
import { studentCopy } from "./content";
import { progressCopy } from "./progress-copy";
import { WeeklyUpdated } from "./weekly-updated";
import { DashboardSidebar } from "./dashboard-sidebar";
import { GoalDialogButton } from "./student-goals";
import { SessionGuard } from "./session-guard";
import { adminCopy } from "../academy-admin/copy";
import { adminCourseCopy } from "../academy-admin/course-copy";
import { AdminCourseButton } from "../academy-admin/course-dialog-button";
import { StudentCreateButton } from "../academy-admin/student-create";
import { CourseEnrollmentButton } from "../academy-admin/course-enrollment-button";
import { StudentCourseEnrollmentButton } from "./student-course-enrollment";
import { studentLinksCopy } from "./student-links-copy";
import { Icon } from "../../components/icon";
import { notificationCopy } from "../notifications/copy";
import { passwordCopy } from "./password-copy";

export function StudentDashboard(props) {
  const { userId, username, progress, management, view, adminCourse } = props;
  const { locale, dir } = usePreferences();
  const copy = studentCopy[locale];
  const progressLabels = progressCopy[locale];
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
    password: passwordCopy[locale].title,
    links: studentLinksCopy[locale].title,
    notifications: notificationCopy[locale].title,
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
            <DashboardContent
              {...props}
              copy={copy}
              progressLabels={progressLabels}
              locale={locale}
            />
          </section>
        </div>
      </div>
    </SessionGuard>
  );
}
