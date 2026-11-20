import { AcademyEntry } from "../../features/academy/academy-entry";
import { PageFrame } from "../../components/page-frame";
import { JsonLd, routeMetadata } from "../../seo/next-metadata";

export const metadata = routeMetadata("academy");

export default function Page() {
  return (
    <PageFrame page="academy">
      <JsonLd page="academy" />
      <AcademyEntry />
    </PageFrame>
  );
}
