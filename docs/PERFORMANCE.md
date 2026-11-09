# Mobile performance changes

Measured locally on 2026-11-08 with Lighthouse 12.8.2, headless Microsoft Edge, a 390 × 844 mobile viewport, default simulated mobile throttling and a fresh browser profile per page. These are individual laboratory runs against the same local server, not PageSpeed results from the public domain.

| Page | Performance before → after | LCP before → after | FCP before → after | Transfer before → after |
| --- | --- | --- | --- | --- |
| Home | 80 → 96 | 4.88 s → 2.63 s | 2.11 s → 1.50 s | 671 KB → 285 KB |
| Academy | 80 → 95 | 4.88 s → 2.78 s | 2.25 s → 1.65 s | 703 KB → 315 KB |

CLS was zero in both final runs. Final TBT was 94 ms for home and 99 ms for academy. The initial local runs had TBT of 0 ms and 17 ms respectively; the reported 390 ms from the public mobile audit was not reproduced locally. Do not describe these measurements as a verified reduction from 390 ms on the live site.

## Changes

- A deferred, minified shared runtime replaces twelve blocking scripts. Public pages load only their own template chunk. Portfolio rendering and data are fetched only when the portfolio route is opened.
- Initial script transfer fell from about 246 KB to 41 KB on home and 50 KB on academy.
- Each public page receives its own stylesheet. Home CSS is about 34 KB; academy CSS is about 53 KB. Complete portfolio styles remain available on demand.
- CSS pruning scans source code, both rendered languages and dynamic state attributes. Forty before/after computed-style snapshots showed no changes in the sampled layout, color, typography and spacing properties. The academy entrance animation was intentionally removed.
- The local variable font was reduced from 111 KB to 80 KB while preserving Arabic shaping, Persian/Arabic text, Latin text and characters used by the site. The original and OFL license remain in the workspace.
- The initial academy content is immediately visible. Expensive mobile backdrop filters are disabled, and the browser uses the small PNG favicon instead of requesting the larger ICO.

## Reproduce

Use Node.js 22.12 or newer:

```powershell
npm ci
npm run package
python -m http.server 4173 --bind 127.0.0.1
```

In another terminal:

```powershell
npm run test:performance
npm run test:browser
```

The performance test enforces CSS/script transfer budgets, verifies that public loads exclude portfolio code/data, and tests delayed chunks and rapid navigation. It does not manufacture a Lighthouse score. The font regeneration tool additionally requires `python -m pip install 'fonttools[woff]'`.

After publishing `dist/`, rerun mobile PageSpeed Insights on the actual domain. Server response time, compression, cache headers, CDN behavior and device conditions can change the results. The temporary Lighthouse installation used for these measurements was removed from project dependencies after testing.

References: [Optimizing LCP](https://web.dev/articles/optimize-lcp), [resource loading](https://web.dev/learn/performance/optimize-resource-loading), [PurgeCSS safelisting](https://www.purgecss.com/safelisting).
