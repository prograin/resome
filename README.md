# prograin

Static bilingual website. Serve this directory with Live Server or `python -m http.server 4173`.

## Editing

- `src/pages/`: page templates and their Persian/English content.
- `src/pages/shared.js`: shared components and footer.
- `src/pages/index.js`: mounts and caches the current page; defers lower backgrounds.
- `src/script.js`: navigation, theme, language and shared dialogs.
- `src/resume.js`: portfolio rendering and interactions, loaded only for the portfolio route.
- `src/loader.js`: loads page scripts and styles on demand; avoids stale renders during rapid navigation.
- `src/site-config.js`: domain, contact information, canonical routes and bilingual SEO metadata.
- `src/seo.js`: updates metadata after client navigation.
- `src/styles.css`: editable stylesheet. `src/output.css` is generated; do not edit it directly.
- `src/ui.css`: shared visual system and responsive page layouts.
- `src/templates/layout.html`: shared HTML shell. All root and route HTML files are generated.
- `scripts/lib/render.mjs`: static rendering and sitemap/robots generation.
- `src/app.js`, `src/chunks/` and `src/styles/`: generated minified runtime assets; edit their source files instead.

Run `npm ci` to install dependencies, then `npm run build` after changing code or styles. The build renders the public content into HTML, minifies CSS, updates cache versions and generates discovery files while keeping the resume marked `noindex`. Run `npm run check` to verify the generated output. See [SEO and publication](docs/SEO.md) before deploying.

The build needs Node.js 22.12 or newer. It generates separate stylesheets for each page and preserves dynamic states by scanning both rendered languages and source templates. Public pages do not download portfolio code/data or other page templates on first load.

`python scripts/optimize_font.py` creates the smaller Persian/Latin font while preserving the original and its license. It requires `fonttools[woff]`. Run it after adding new scripts or changing the font source.

Run `npm run package` for a clean `dist/` directory ready for static hosting. Original images remain in the workspace; only web-ready backgrounds and client icons are included in the upload directory.

Vercel uses the root `vercel.json`: Build Command is `npm run package`, Output Directory is `dist`, and Framework Preset is Other. It also configures the uncached update manifest and private-route indexing headers; Vercel does not use `_headers`.

Mobile measurement results and performance checks are documented in [PERFORMANCE.md](docs/PERFORMANCE.md).

## Background images

Keep original images in `assets/images/` under these names:

`home-bg.jpg`, `contact-bg.jpg`, `academy-hero-bg.jpg`, `academy-training-bg.jpg`, `academy-decision-bg.jpg`, `academy-youtube-bg.jpg`.

After replacing images, run:

```powershell
npm run build
```

The optimizer preserves originals and creates desktop/mobile WebP copies under `assets/images/optimized/`, plus small client logos. The site serves these optimized copies. Local Vazirmatn font and its license are in `assets/fonts/`.

The build automatically regenerates optimized copies when original images change. Every release includes content-based asset versions, so updated images use fresh URLs while repeat visits within the same release stay fast.

## Update notification

Deploy the complete `dist/` directory from `npm run package`, including `site-version.json`. Open pages check for a newer release after 15 seconds and every minute, and when returning to the tab. A Persian/English dialog offers Update or Later. Update reloads the current page with a fresh URL; Later dismisses that release for this visit. Existing package dialogs finish before the update prompt appears.

`_headers` configures HTML revalidation and disables caching for the version manifest on compatible hosts. Other hosts must apply equivalent Cache-Control headers. Users receive the notification once they have loaded a release containing this feature. Run `npm run test:updates` to verify versioned assets and update interactions.

## Browser checks

With the local server running and Microsoft Edge installed:

```powershell
npm run test:browser
```

UI checks cover five pages at four viewport widths, both languages and both themes, package feature dialogs, mobile navigation, academy tabs and portfolio dialogs. The accessibility checks cover the public pages at phone and desktop widths. Screenshots and the audit report are saved in the ignored `.backup/qa/` directory.

Interaction regressions also cover restricted browser storage, Ctrl/Command-click and new-tab links, hash navigation, legacy portfolio fragments, and closing dialogs during browser history navigation.
