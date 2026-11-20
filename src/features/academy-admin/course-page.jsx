import { notFound } from "next/navigation";
import { PageFrame } from "../../components/page-frame";
import { StudentDashboard } from "../students/student-dashboard";
import { requireAcademyAdmin } from "../../lib/student-auth/admin-session";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { adminUsername } from "../../lib/student-progress";
import { databaseId } from "../../lib/validation/forms";
import { readAdminCourse, readAdminCourses } from "../../lib/db/admin-courses";

export const adminCourseMetadata = {
  title: "دوره‌ها | مدیریت آکادمی Prograin",
  robots: { index: false, follow: false },
};

export async function AdminCoursesPage({ params }) {
  const { user } = await requireAcademyAdmin();
  const { db } = getStudentRuntime();
  const resolved = params ? await params : {};
  const route = resolved.definitionId == null ? null : resolved;
  let course = null;
  if (route) {
    const id = databaseId.safeParse(Number(route.definitionId));
    if (!id.success || !["grades", "students"].includes(route.view)) notFound();
    course = await readAdminCourse(db, adminUsername(), id.data, route.view === "grades");
    if (!course) notFound();
  }
  const catalog = route ? null : await readAdminCourses(db, adminUsername());
  return (
    <PageFrame page="academy-admin">
      <StudentDashboard
        key={user.id}
        userId={user.id}
        username={user.username}
        view={route ? `admin-${route.view}` : "admin-courses"}
        adminCourses={catalog}
        adminCourse={course}
        management={{ students: [] }}
      />
    </PageFrame>
  );
}
