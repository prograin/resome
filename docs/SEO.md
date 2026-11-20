# SEO and publication

The configured public origin is `https://www.prograin.ir` in `src/config/site.js`. The apex domain redirects to this host. Change the configured origin if a different production host is used, then rebuild.

The local focus is Arak, Markazi Province, Iran. The shared `location` configuration keeps city/province references consistent in the address, service areas, contact page, footer and social cards. The visible content and metadata focus on programming classes and programming education in Arak, plus website development for local businesses. No street address, coordinates, branch location or customer reviews are invented.

## What the build produces

- Complete Persian HTML for the public pages, with meaningful headings and internal links before JavaScript runs.
- Page-specific titles, descriptions, canonical URLs, Open Graph and Twitter previews.
- Linked Organization, Person, WebSite, WebPage, Service and BreadcrumbList JSON-LD based on the site's actual content. No invented reviews, street address or ratings.
- A sitemap with only canonical public URLs. No fabricated modification dates.
- `noindex` on the resume and both portfolio aliases, with no public links to those pages. Robots allows their crawling so crawlers can read `noindex`.
- `_headers` rules for supported static hosts, adding `X-Robots-Tag` to resume routes. On other hosts, mirror these rules in server configuration if desired. Meta `noindex` is present independently of these headers.

`noindex` removes a page from participating search results; it does not password-protect a URL. Anyone who already has a direct link can still open it.

## Publish the site

1. Run `npm ci` and `npm run package` (which builds and checks the site).
2. Deploy with the Next.js preset on Vercel, or serve the build on a Node.js host. Student login and dashboard routes are excluded from the sitemap and request no indexing.
3. Ensure the actual host serves the canonical paths with successful responses and returns a real 404 for nonexistent pages. Do not redirect the portfolio aliases to a public page.
4. Verify the real domain in Google Search Console. Submit `https://www.prograin.ir/sitemap.xml` and inspect its URLs. Request indexing after checking the rendered page.
5. Use Search Console's indexing and Core Web Vitals reports after Google has crawled the published version. Local test results do not prove that Google has indexed the live site, and ranking cannot be guaranteed.

The same URL supports a client-side English language option. It does not advertise separate English `hreflang` URLs that do not exist.

## Editing and checks

Edit the shared shell in `src/app/layout.jsx`, page text in `src/content/`, markup in `src/features/`, identity in `src/config/site.js`, SEO in `src/content/seo/` and `src/seo/`, and design in `src/css/`. Never edit generated route HTML directly.

`npm run images:social` recreates the four 1200 × 630 share cards using the local font and logo; rebuild afterward.

For browser checks, run `npm run preview` after packaging and run `npm run test:browser`. This checks content without JavaScript, metadata consistency during navigation, both languages and themes, mobile layouts, package feature dialogs, other interactions and automated accessibility rules. Reports and screenshots go to `.backup/qa/`.

References: [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
