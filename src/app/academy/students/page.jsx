import { redirect } from "next/navigation";
import { PageFrame } from "../../../components/page-frame";
import { StudentLogin } from "../../../features/students/student-login";
import { readStudentSession } from "../../../lib/student-auth/session";
import { studentPaths } from "../../../lib/student-auth/paths";
import { routeMetadata } from "../../../seo/next-metadata";
import { isStudentAdmin } from "../../../lib/student-progress";
import { notificationReturnTo } from "../../../lib/notifications/targets";

export const metadata = routeMetadata("academy-students");

export default async function Page({ searchParams }) {
  const returnTo = notificationReturnTo((await searchParams)?.next);
  const session = await readStudentSession();
  if (session)
    redirect(
      returnTo ?? (isStudentAdmin(session.user) ? studentPaths.admin : studentPaths.dashboard),
    );
  return (
    <PageFrame page="academy-students">
      <StudentLogin returnTo={returnTo} />
    </PageFrame>
  );
}
