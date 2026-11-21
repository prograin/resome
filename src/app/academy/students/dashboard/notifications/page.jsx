import { routeMetadata } from "../../../../../seo/next-metadata";
import { DashboardPage } from "../dashboard-page";

export const metadata = routeMetadata("academy-notifications");

export default function Page() {
  return <DashboardPage view="notifications" />;
}
