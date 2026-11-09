import "../assets.js";
import { origin, routes } from "../config/site.js";
import fa from "../content/seo/fa.json";
import en from "../content/seo/en.json";
const copy = { fa, en };
const asset = (value) => window.SITE_ASSETS.url(value);

function metadata(page = "home", locale = "fa") {
  const route = routes[page] || routes.home;
  return {
    ...((copy[locale] || copy.fa)[page] || copy.fa.home),
    canonical: `${origin}${route.path}`,
    robots: route.private
      ? "noindex, nofollow, noarchive"
      : "index, follow, max-image-preview:large",
    image: asset(
      route.private
        ? `${origin}/assets/icons/icon-512.png`
        : `${origin}/assets/images/social/${page === "contact-page" ? "contact" : page}.jpg`,
    ),
    imageWidth: route.private ? 512 : 1200,
    imageHeight: route.private ? 512 : 630,
    locale: locale === "en" ? "en_US" : "fa_IR",
  };
}

export { metadata };
