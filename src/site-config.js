// Shared identity and SEO facade for build-time rendering and browser navigation.
import { origin, location, contact, routes } from "./config/site.js";
import { metadata } from "./seo/metadata.js";
import { structuredData } from "./seo/schema.js";
window.SITE_CONFIG = { origin, location, contact, routes, metadata, structuredData };
