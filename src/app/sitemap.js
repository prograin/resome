import { origin, routes } from "../config/site";
export const dynamic = "force-static";
export default function sitemap() {
  return Object.values(routes)
    .filter((route) => !route.private)
    .map((route) => ({ url: origin + route.path }));
}
