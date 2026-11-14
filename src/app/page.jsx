import { Home } from "../features/home/home";
import { PageFrame } from "../components/page-frame";
import { JsonLd, routeMetadata } from "../seo/next-metadata";

export const metadata = routeMetadata("home");

export default function Page() {
  return (
    <PageFrame page="home">
      <JsonLd page="home" />
      <Home />
    </PageFrame>
  );
}
