# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Public **distribution** repository for DeskUtils, a private-source macOS menu bar app.
It holds the marketing website and public update assets only — no Swift application
source and no signing keys. Feature availability, permissions, and system requirements
are defined by the private app; treat the shipped app + verified release artifact as
the source of truth and update website content to match it, never the reverse.

Three top-level areas:

- `web/` — the Next.js website (all active development happens here).
- `site/` — distribution-owned assets: `assets/` images & icons, `CNAME`, and the
  Sparkle-signed `appcast.xml`. Never hand-edit `appcast.xml` or its signatures; it is
  regenerated/signed by scripts in the private app repo. The web build asserts the
  copied feed is byte-for-byte identical to this source.
- `deskutils-product-video/` — product video project (self-contained).

## Commands (run inside `web/`)

```bash
npm ci
npm run dev          # prepare assets/media + next dev on 127.0.0.1:3000
npm run build        # prepare assets/media + static export + verify-output.mjs
npm run preview      # serve out/ on 127.0.0.1:3000
npm run sync:releases # explicitly refresh the committed changelog snapshot
npm run lint         # eslint, --max-warnings=0
npm run typecheck    # tsc --noEmit
npm run format:check # prettier check (CI gate — run format to fix)
npm test             # node --test tests/*.test.mjs
npm run test:browser # Playwright against static export served from out/ on :3100
node scripts/check-translations.mjs # route/shared key completeness
```

CI (`.github/workflows/pages.yml`) runs, in order: `lint`, `typecheck`,
`format:check`, `test`, `build`, then Playwright. All must pass. On macOS with Chrome
installed, prefer `PLAYWRIGHT_CHANNEL=chrome npm run test:browser` to skip the Chromium
download. `test:browser` needs a fresh `out/` (`npm run build` first).

The root `.claude/launch.json` previews an existing `web/out/` build using the
static server with correct 404 handling. `web/.claude/launch.json` starts the
development server when Claude is opened from `web/`.

Run a single unit test file: `node --test tests/release.test.mjs`
Run a single browser test: `npx playwright test tests/website.spec.ts -g "<title>"`

## Architecture

**Static export.** `next.config.ts` sets `output: 'export'`, `trailingSlash: true`,
`images.unoptimized`. The deployable artifact is `web/out/` (gitignored — never commit
generated output). No server runtime exists at deploy time; everything is pre-rendered.

**`prepare:assets` runs before every dev/build** (`scripts/prepare-assets.mjs`): copies
`site/{assets,appcast.xml,CNAME}` into `web/public/` and generates a resized webp icon.
The copied files under `web/public/assets`, `web/public/appcast.xml`, `web/public/CNAME`
are gitignored build inputs — edit the originals in `site/`.

**`prepare:media` also runs before dev/build.** `content/media.manifest.json`
defines slots; `scripts/media.mjs` generates responsive variants from gitignored
`media-src/` masters into `public/media/`. `ProductVisual` prefers generated media,
then approved temporary mockups. Read `web/MEDIA.md` before replacing assets.
Media tests must use temporary directories, never delete real masters.

**Internationalization (10 locales).** English is served at the site root from the
`app/(english)/` route group. Every other locale is served under `/<locale>/` from
`app/(localized)/[locale]/`. Both groups are thin wrappers around shared components
in `components/pages/` or the utility template in `components/features/utility/`.
Shared components accept a `locale` prop; route files must not export reusable
components or import another route's page. The localized layout's
`generateStaticParams` enumerates non-English locales; wrappers reject `en` and
unknown locales to avoid duplicate routes.

- Locale list and helpers: `content/locales.ts` (`languages`, `localePath`, `isLocale`).
- Translation strings: `content/messages/<locale>.ts`. `en.ts` is canonical and its
  keys define the `MessageKey` type; every other catalog must implement the same keys.
  Look up strings with `translate(locale, key, values)` from `content/i18n.ts`
  (`{name}` placeholders interpolate from `values`).
- Published paths, navigation and sitemap: `content/routes.ts`.
- Per-page SEO/metadata: `content/metadata.ts` (`routeMetadata`) builds canonical +
  hreflang alternates and OpenGraph per locale. `content/translations.ts` governs
  route/shared key completeness; incomplete equivalents remain noindex and are
  excluded from sitemap/hreflang. Feedback is intentionally noindex in all locales.
- Preserve release notes, Reddit quotes and app mockup text in their source
  language; do not translate or invent release notes.

**Product facts live in `content/product.ts`** — free app pricing, optional Ko-fi
support URL, downloads, minimum macOS and clipboard capacity. Every feature is
free; no checkout, discount or launch-offer environment variable changes that.
Donations do not unlock features. The existing `/pricing/` URL and `#pricing`
anchor remain available as Free & Support so incoming links keep working.
Publish this copy only after a matching free app release is publicly available.

**Post-build verification** (`scripts/verify-output.mjs`, part of `npm run build`)
asserts each exported route has the right `<html lang>`, a `#main` landmark, an `<h1>`,
a canonical link, social metadata, and — importantly — that no outdated product copy
(old prices, retired feature names) leaked in. If you change pricing/feature wording,
update the forbidden-copy regex there too.

## Styling

See `web/AGENTS.md` for the styling rules (Tailwind CSS v4 + daisyUI configured in
`app/globals.css`, shared tokens, route structure and localization contracts).
The bundled `.agents/skills/daisyui/` guides cover component usage; project design
rules and approved mockups take precedence over generic component defaults.

> **Next.js 16 caveat** (from `web/AGENTS.md`): this is a newer Next.js than training
> data reflects — APIs and conventions may differ. Consult
> `web/node_modules/next/dist/docs/` before writing framework code. `next dev`
> rewrites the `nextjs-agent-rules` block in `web/AGENTS.md`; commit that change with
> your work rather than fighting it.

## Design intent

`web/DESIGN.md` defines the approved Claude export composition, desktop/mobile
layouts and temporary product mockups. Approved mockups stay visible until real
captures are available; published pages must not contain empty media placeholders. The
root `DeskUtils Landing Page.pdf` is a wireframe for context only, **not** an approved
design; do not restore its section order or density as a requirement.

Validate responsive layouts in Chrome. Linux/Chromium visual baselines are
intentionally deferred by the owner; do not treat their absence as a release
blocker or generate replacement baselines without checking the approved design.

## Release / deploy

Production uses **Vercel** with project root `web/`. Public feedback configuration
is embedded at build time; rebuild after changing it. The Feedback endpoint is
`NEXT_PUBLIC_DESKUTILS_FEEDBACK_FORM_ENDPOINT`, with a support-email fallback when
unset. Tests mock submissions; never send test feedback to production.

`/changelog/` statically renders `content/releases.json`. Ordinary builds/tests
do not fetch release data. Run `npm run sync:releases` to refresh the snapshot;
sync failures must not overwrite it with empty data.

`web/RELEASE.md` also documents the optional GitHub Pages workflow and its existing
release gates. Those gates apply to GitHub Pages, not Vercel. Do not change deploy
conditions or push/deploy merely because a code review or commit was requested.
