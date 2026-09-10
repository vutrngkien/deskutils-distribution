# DeskUtils Distribution

Public distribution repository for DeskUtils, a private-source macOS menu bar app.
It contains the website and public update assets, not Swift application source or
private signing keys.

## Website

The redesigned site is a **Next.js / React / TypeScript static export** in `web/`.
It uses CSS Modules, pre-rendered pages and local media. Production remains
[deskutils.app](https://deskutils.app/) on GitHub Pages.

```bash
cd web
npm ci
npm run dev
```

Preview: <http://127.0.0.1:3000>. For a production preview:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run preview
```

`web/out/` is the deployment artifact; do not commit generated output. `site/`
retains distribution-owned images, icons, `CNAME` and the signed `appcast.xml`.
The asset preparation step copies those into the build. Source pages now live in
`web/app/`; product details, prices and media live in `web/content/product.ts`.

See [media instructions](web/MEDIA.md) to replace the video placeholders.
See [release checks](web/RELEASE.md) before enabling production deployment.
The PDF is a wireframe, not the final design. The landing page follows a simpler
product-first structure inspired by OneMenu, with its own DeskUtils tool palette.
See [design direction](web/DESIGN.md). Product facts come from the DeskUtils
source app and release workflow.
CI builds the site and uploads a downloadable preview artifact while release
readiness is disabled. The current live site is not changed by a local build.

Browser checks use Playwright against the static production export:

```bash
npx playwright install chromium
npm run test:browser
```

On macOS with Google Chrome already installed, use
`PLAYWRIGHT_CHANNEL=chrome npm run test:browser` instead of installing Chromium.

## Downloads and updates

The stable download URL remains:

https://github.com/vutrngkien/deskutils-distribution/releases/latest/download/DeskUtils.dmg

Each app release contains `DeskUtils.dmg`, `DeskUtils-<version>.zip`,
`SHA256SUMS.txt` and `appcast.xml`. Generate and sign `site/appcast.xml` with the
existing release scripts after uploading the versioned ZIP. Never manually edit
Sparkle signatures or commit private keys. The website build verifies that the
copied appcast is byte-for-byte identical to its source.
