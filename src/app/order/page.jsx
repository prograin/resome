import { Order } from "../../features/order/order";
import { PageFrame } from "../../components/page-frame";
import { JsonLd, routeMetadata } from "../../seo/next-metadata";

export const metadata = routeMetadata("order");

export default function Page() {
  return (
    <PageFrame page="order">
      <JsonLd page="order" />
      <Order />
    </PageFrame>
  );
}
