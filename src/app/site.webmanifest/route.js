import manifest from "../../../site.webmanifest.json";
import { assetUrl } from "../../config/assets";
export const dynamic = "force-static";
export function GET() {
  const icons = manifest.icons.map((icon) => ({ ...icon, src: assetUrl(icon.src) }));
  return Response.json(
    { ...manifest, icons },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
