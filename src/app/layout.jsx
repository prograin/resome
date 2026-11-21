import { assetUrl } from "../config/assets";
import { origin } from "../config/site";
import { Header } from "../components/header";
import { Background } from "../components/background";
import { PreferencesProvider } from "../components/preferences";
import { DetailsDialogProvider } from "../components/details-dialog";
import { SiteUpdates } from "../components/site-updates";
import { LegacyLinks } from "../components/legacy-links";
import { AcademyMenuProvider } from "../components/academy-menu";
import { AcademyAppBoundary } from "../components/academy-app-boundary";

export const metadata = {
  metadataBase: new URL(origin),
  icons: {
    icon: [{ url: assetUrl("/assets/icons/favicon-48.png"), type: "image/png", sizes: "48x48" }],
    apple: [{ url: assetUrl("/assets/icons/apple-touch-icon.png"), sizes: "180x180" }],
  },
};
export const viewport = { themeColor: "#f8fafc" };

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="overflow-x-hidden" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href={assetUrl("/assets/fonts/Vazirmatn-fa-latin.woff2")}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <noscript>
          <style>{`
        .pricing-card__feature-extra[hidden] { display: flex !important; }
        .pricing-card__toggle, .academy-plan__details, .academy-tabs, #langToggle, #themeToggle, #mobileMenuBtn, #academyMenuButton { display: none !important; }
        .academy-page .academy-plan { display: block !important; margin-bottom: 1rem; }
      `}</style>
        </noscript>
        <PreferencesProvider>
          <AcademyMenuProvider>
            <DetailsDialogProvider>
              <AcademyAppBoundary>
                <Background />
                <Header />
                <LegacyLinks />
                {children}
              </AcademyAppBoundary>
            </DetailsDialogProvider>
          </AcademyMenuProvider>
          <SiteUpdates />
        </PreferencesProvider>
      </body>
    </html>
  );
}
