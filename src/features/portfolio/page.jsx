import { Portfolio } from "./portfolio";
import { PageFrame } from "../../components/page-frame";
import { routeMetadata } from "../../seo/next-metadata";

export const metadata = routeMetadata("resume");

export default function PortfolioPage() {
  return (
    <PageFrame page="resume">
      <Portfolio />
    </PageFrame>
  );
}
