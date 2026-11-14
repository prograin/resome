import { Contact } from "../../features/contact/contact";
import { PageFrame } from "../../components/page-frame";
import { JsonLd, routeMetadata } from "../../seo/next-metadata";

export const metadata = routeMetadata("contact-page");

export default function Page() {
  return (
    <PageFrame page="contact-page">
      <JsonLd page="contact-page" />
      <Contact />
    </PageFrame>
  );
}
