import { PageFrame } from "../../components/page-frame";
import { StudentDashboard } from "../students/student-dashboard";
import { requireAcademyAdmin } from "../../lib/student-auth/admin-session";
import { getStudentRuntime } from "../../lib/student-auth/server";
import { readAcademyAdmin } from "../../lib/db/academy-admin";
import { adminUsername } from "../../lib/student-progress";

export async function AdminDirectoryPage({ searchParams, studentsOnly = false }) {
  const { user } = await requireAcademyAdmin();
  const directory = await readAcademyAdmin(
    getStudentRuntime().db,
    adminUsername(),
    await searchParams,
  );
  return (
    <PageFrame page="academy-admin">
      <StudentDashboard
        key={user.id}
        userId={user.id}
        username={user.username}
        view={studentsOnly ? "admin-directory" : "admin"}
        directory={directory}
        management={{}}
      />
    </PageFrame>
  );
}
