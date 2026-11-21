import { PageFrame } from "../../../../components/page-frame";
import { visibleStudentEmail } from "../../../../lib/student-auth/student-email";
import { notFound, redirect } from "next/navigation";
import { studentPaths } from "../../../../lib/student-auth/paths";
import { StudentDashboard } from "../../../../features/students/student-dashboard";
import { requireStudentSession } from "../../../../lib/student-auth/session";
import { readStudentGoals } from "../../../../lib/student-goals";
import { readWeeklyStats } from "../../../../lib/student-weekly";
import { getStudentRuntime } from "../../../../lib/student-auth/server";
import { listCourseDefinitions } from "../../../../lib/db/course-definitions";
import { readStudentLinksPage } from "../../../../lib/db/student-links";
import {
  adminUsername,
  isStudentAdmin,
  listStudents,
  readStudentCourses,
  readStudentHistory,
  readStudentProgress,
} from "../../../../lib/student-progress";

export async function DashboardPage({ searchParams, view = "overview" }) {
  const rawParams = (await searchParams) ?? {};
  const { user } = await requireStudentSession(
    {
      notifications: studentPaths.notifications,
      history: studentPaths.history,
      courses: studentPaths.courses,
    }[view],
  );
  const admin = isStudentAdmin(user);
  const studentView =
    admin && !["profile", "links", "notifications"].includes(view) && Boolean(rawParams.student);
  const params = studentView ? rawParams : {};
  if (admin && view === "overview" && !params?.student) redirect(studentPaths.admin);
  const students = studentView ? await listStudents() : [];
  const definitions =
    admin && view === "overview" ? await listCourseDefinitions(getStudentRuntime().db) : [];
  const selected = students.find(({ id }) => id === params.student) ?? students[0];
  if (admin && params.student && selected?.id !== params.student) notFound();
  const studentId = studentView ? selected?.id : user.id;
  const read = {
    overview: readStudentProgress,
    chart: readStudentProgress,
    history: readStudentHistory,
    courses: readStudentCourses,
    goals: readStudentGoals,
  }[view];
  const progress = studentId && read ? await read(studentId) : null;
  if (progress && (view === "chart" || view === "overview")) {
    progress.courses = (await readStudentCourses(studentId)).courses;
    progress.weekly = await readWeeklyStats(getStudentRuntime().db, studentId, adminUsername());
  }
  if (progress && view === "overview") {
    progress.goals = (await readStudentGoals(studentId)).goals;
  }
  const page = {
    overview: "academy-dashboard",
    chart: "academy-chart",
    history: "academy-history",
    courses: "academy-courses",
    goals: "academy-goals",
    profile: "academy-profile",
    links: "academy-links",
    notifications: "academy-notifications",
  }[view];

  return (
    <PageFrame page={page}>
      <StudentDashboard
        key={user.id}
        userId={user.id}
        username={user.username}
        profile={
          view === "profile"
            ? {
                username: user.username,
                email: visibleStudentEmail(user.email),
                firstName: user.firstName,
                lastName: user.lastName,
                github: user.github,
                telegram: user.telegram,
                linkedin: user.linkedin,
                website: user.website,
              }
            : undefined
        }
        view={view}
        progress={progress}
        studentsLinks={
          view === "links"
            ? await readStudentLinksPage(getStudentRuntime().db, adminUsername())
            : undefined
        }
        management={admin ? { students, selected, definitions } : null}
      />
    </PageFrame>
  );
}
