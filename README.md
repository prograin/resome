# prograin

Static bilingual website. Serve this directory with Live Server or `python -m http.server 4173`.

## Editing

- `src/pages/`: page templates and their Persian/English content.
- `src/pages/shared.js`: shared components and footer.
- `src/pages/index.js`: mounts and caches the current page; defers lower backgrounds.
- `src/script.js`: navigation, theme, language and portfolio interactions.
- `src/site-config.js`: domain, contact information, canonical routes and bilingual SEO metadata.
- `src/seo.js`: updates metadata after client navigation.
- `src/styles.css`: editable stylesheet. `src/output.css` is generated; do not edit it directly.
- `src/ui.css`: shared visual system and responsive page layouts.
- `src/templates/layout.html`: shared HTML shell. All root and route HTML files are generated.
- `scripts/lib/render.mjs`: static rendering and sitemap/robots generation.

Run `npm ci` to install dependencies, then `npm run build` after changing code or styles. The build renders the public content into HTML, minifies CSS, updates cache versions and generates discovery files while keeping the resume marked `noindex`. Run `npm run check` to verify the generated output. See [SEO and publication](docs/SEO.md) before deploying.

Run `npm run package` for a clean `dist/` directory ready for static hosting. Original images remain in the workspace; only web-ready backgrounds and client icons are included in the upload directory.

## Background images

Keep original images in `assets/images/` under these names:

`home-bg.jpg`, `contact-bg.jpg`, `academy-hero-bg.jpg`, `academy-training-bg.jpg`, `academy-decision-bg.jpg`, `academy-youtube-bg.jpg`.

After replacing images, run:

```powershell
python -m pip install Pillow
python scripts/optimize_images.py
node scripts/build.mjs
```

The optimizer preserves originals and creates desktop/mobile WebP copies under `assets/images/optimized/`, plus small client logos. The site serves these optimized copies. Local Vazirmatn font and its license are in `assets/fonts/`.

## Browser checks

With the local server running and Microsoft Edge installed:

```powershell
npm run test:browser
```

UI checks cover five pages at four viewport widths, both languages and both themes, package feature dialogs, mobile navigation, academy tabs and portfolio dialogs. The accessibility checks cover the public pages at phone and desktop widths. Screenshots and the audit report are saved in the ignored `.backup/qa/` directory.

Interaction regressions also cover restricted browser storage, Ctrl/Command-click and new-tab links, hash navigation, legacy portfolio fragments, and closing dialogs during browser history navigation.
