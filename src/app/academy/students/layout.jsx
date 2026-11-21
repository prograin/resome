import { assetUrl } from "../../../config/assets";
import { AcademyAppSetup } from "../../../features/academy-app/app-setup";
import { academyApp } from "../../../features/academy-app/paths";

export const metadata = {
  manifest: academyApp.manifest,
  appleWebApp: { capable: true, title: "Prograin Academy", statusBarStyle: "default" },
  icons: {
    icon: [
      { url: assetUrl("/assets/icons/academy/favicon-48.png"), type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: assetUrl("/assets/icons/academy/apple-touch-icon.png"), sizes: "180x180" }],
  },
};
export const viewport = { themeColor: "#dce5ef", viewportFit: "cover" };

export default function StudentLayout({ children }) {
  return (
    <>
      <span hidden data-academy-app-page />
      <AcademyAppSetup />
      {children}
    </>
  );
}
