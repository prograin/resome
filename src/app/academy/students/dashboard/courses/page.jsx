import { routeMetadata } from "../../../../../seo/next-metadata";
import { DashboardPage } from "../dashboard-page";

export const metadata = routeMetadata("academy-courses");

export default function Page({ searchParams }) {
  return <DashboardPage searchParams={searchParams} view="courses" />;
}
