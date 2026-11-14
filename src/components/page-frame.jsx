import { routes } from "../config/site";
import { assetUrl } from "../config/assets";
import { Footer } from "./footer";
import { PageMetadataSync } from "./page-metadata-sync";

export function PageFrame({ page, children }) {
  const route = routes[page];
  return (
    <>
      <link
        rel="stylesheet"
        precedence="site"
        href={assetUrl(`/styles/${route.private ? "portfolio" : route.body}.css`)}
      />
      <PageMetadataSync page={page} />
      {route.background &&
        [960, 1920].map((size) => (
          <link
            key={size}
            rel="preload"
            as="image"
            href={assetUrl(`/assets/images/optimized/${route.background}-bg-${size}.webp`)}
            media={size === 960 ? "(width <= 48rem)" : "(width > 48rem)"}
            fetchPriority="high"
          />
        ))}
      <main
        data-site-page={route.body}
        className="site-main mx-auto w-full max-w-6xl overflow-x-hidden px-4"
      >
        <section id={route.container} className="page-view" data-page={page}>
          {children}
        </section>
      </main>
      {!route.private && <Footer />}
    </>
  );
}
