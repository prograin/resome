export { AdminDirectoryPage as default } from "../../../../../features/academy-admin/directory-page";
import { routeMetadata } from "../../../../../seo/next-metadata";

export const metadata = {
  ...routeMetadata("academy-admin"),
  robots: { index: false, follow: false, noarchive: true },
};
