import { Academy } from "../../../features/academy/academy";
import { PageFrame } from "../../../components/page-frame";
import { JsonLd, routeMetadata } from "../../../seo/next-metadata";

export const metadata = routeMetadata("academy-consultation");

export default function Page() {
  return (
    <PageFrame page="academy-consultation">
      <JsonLd page="academy-consultation" />
      <Academy />
    </PageFrame>
  );
}
