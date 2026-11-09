# SEO and publication

The configured public origin is `https://prograin.ir` in `src/site-config.js`. Change it there if a different domain is used, then rebuild. Do not publish canonical URLs pointing at a preview hostname or localhost.

The local focus is Arak, Markazi Province, Iran. The shared `location` configuration keeps city/province references consistent in the address, service areas, contact page, footer and social cards. The visible content and metadata focus on programming classes and programming education in Arak, plus website development for local businesses. No street address, coordinates, branch location or customer reviews are invented.

## What the build produces

- Complete Persian HTML for the four public pages, with meaningful headings and internal links before JavaScript runs.
- Page-specific titles, descriptions, canonical URLs, Open Graph and Twitter previews.
- Linked Organization, Person, WebSite, WebPage, Service and BreadcrumbList JSON-LD based on the site's actual content. No invented reviews, street address or ratings.
- A sitemap with only canonical public URLs. No fabricated modification dates.
- `noindex` on the resume and both portfolio aliases, with no public links to those pages. Robots allows their crawling so crawlers can read `noindex`.
- `_headers` rules for supported static hosts, adding `X-Robots-Tag` to resume routes. On other hosts, mirror these rules in server configuration if desired. Meta `noindex` is present independently of these headers.

`noindex` removes a page from participating search results; it does not password-protect a URL. Anyone who already has a direct link can still open it.

## Publish the site

1. Run `npm ci` and `npm run package` (which builds and checks the site).
2. Publish the contents of the generated `dist/` directory. It includes only runtime files and omits `.backup/`, `node_modules/`, source templates, archives, development scripts and oversized original backgrounds.
3. Ensure the actual host serves the canonical paths with successful responses and returns a real 404 for nonexistent pages. Do not redirect the portfolio aliases to a public page.
4. Verify the real domain in Google Search Console. Submit `https://prograin.ir/sitemap.xml` and inspect the four public URLs. Request indexing after checking the rendered page.
5. Use Search Console's indexing and Core Web Vitals reports after Google has crawled the published version. Local test results do not prove that Google has indexed the live site, and ranking cannot be guaranteed.

The same URL supports a client-side English language option. It does not advertise separate English `hreflang` URLs that do not exist.

## Editing and checks

Edit the shared shell in `src/templates/layout.html`, page text in `src/content/`, markup in `src/pages/`, identity in `src/config/site.js`, SEO in `src/content/seo/` and `src/seo/`, and design in `src/css/`. Never edit generated route HTML directly.

`npm run images:social` recreates the four 1200 × 630 share cards using the local font and logo; rebuild afterward.

For browser checks, start a static server on port 4173 and run `npm run test:browser`. This checks content without JavaScript, metadata consistency during navigation, both languages and themes, mobile layouts, package feature dialogs, other interactions and automated accessibility rules. Reports and screenshots go to `.backup/qa/`.

References: [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
