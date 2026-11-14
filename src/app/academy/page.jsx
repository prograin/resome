import { Academy } from "../../features/academy/academy";
import { PageFrame } from "../../components/page-frame";
import { JsonLd, routeMetadata } from "../../seo/next-metadata";

export const metadata = routeMetadata("academy");

export default function Page() {
  return (
    <PageFrame page="academy">
      <JsonLd page="academy" />
      <Academy />
    </PageFrame>
  );
}
