import Image from "next/image";
import { assetUrl } from "../config/assets";
import { SiteLink } from "./site-link";
import { studentPaths } from "../lib/student-auth/paths";

export function AcademyBrand({ dir = "ltr" }) {
  return (
    <SiteLink href={studentPaths.dashboard} className="student-shell__brand" dir={dir}>
      <Image
        unoptimized
        src={assetUrl("/assets/icons/academy/icon-192.png")}
        width={32}
        height={32}
        alt=""
      />
      <span>Prograin Academy</span>
    </SiteLink>
  );
}
