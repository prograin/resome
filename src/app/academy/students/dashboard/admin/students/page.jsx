import { AdminDirectoryPage } from "../../../../../../features/academy-admin/directory-page";

export const metadata = {
  title: "شاگردان | مدیریت آکادمی Prograin",
  robots: { index: false, follow: false },
};

export default function StudentsPage({ searchParams }) {
  return <AdminDirectoryPage searchParams={searchParams} studentsOnly />;
}
