# Prograin

Bilingual software development and programming education website built with Next.js App Router.

```sh
npm ci
npm run dev
```

Open [http://localhost:4173](http://localhost:4173). The development server supports fast refresh for page and content changes. Restart it after changing stylesheet sources or original images so it can regenerate the assets.

- `src/app/` defines routes, the shared layout, metadata endpoints and the 404 page.
- `src/features/` contains route components. Shared UI and browser preferences live in `src/components/`.
- `src/content/` stores bilingual copy, prices, FAQs and portfolio data.
- `src/css/` contains small stylesheet modules. `src/css/index.css` sets their order.
- `src/seo/` supplies route metadata and structured data. Update the domain in `src/config/site.js`.
- `src/resume/` contains the portfolio sections, rendering and filtering. Its runtime and data are scoped to the portfolio routes.

For production, run `npm run package`. Next.js prerenders the public routes and exports the site to `out/`. Vercel uses the checked-in build command and output directory. The asset preparation step creates responsive WebP backgrounds and release-versioned assets. Keep originals in `assets/`. See [the editing guide](docs/STRUCTURE.md) and [SEO and publication](docs/SEO.md).

To test the production export, run `npm run preview` after packaging and open port 4173. Set the `PORT` environment variable if the port is in use. `npm run test:browser`, `npm run test:performance` and `npm run test:updates` target that preview by default and accept a `SITE_URL` override. Browser tests use Microsoft Edge through Playwright.

Use `npm run lint` and `npm run format:check` to check code style. Use `npm run format` to apply formatting.
