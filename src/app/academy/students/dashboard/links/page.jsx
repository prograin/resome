import { routeMetadata } from "../../../../../seo/next-metadata";
import { DashboardPage } from "../dashboard-page";

export const metadata = routeMetadata("academy-links");

export default function Page() {
  return <DashboardPage view="links" />;
}
