<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Styling

- Tailwind CSS v4 + daisyUI 5 are configured in `app/globals.css` via
  `@import 'tailwindcss'`, `@plugin "daisyui"` and the custom `deskutils`
  theme; `postcss.config.mjs` runs `@tailwindcss/postcss`.
- Use the daisyUI `deskutils` theme tokens (`base-100`, `primary`, `secondary`,
  `accent`, `neutral`, `base-content`, `success`, `error`) and the shared
  component classes (`.container-page`, `.section`, `.section-tint`,
  `.section-dark`, `.eyebrow`, `.h-display`, `.h-section`, `.h-feature`, `.lede`,
  `.keys`, `.card-surface`, `.cta-band`). Avoid default daisyUI looks.
- Fonts: self-hosted Geist via `next/font` in `components/fonts.ts`; the font
  variables are set on `<html>` by both root layouts. Icons use `lucide-react`
  through `components/ToolIcon.tsx` — do not add an icon font.
- Responsive breakpoints: `md` (768), `lg` (1024), and a custom `dt` (75rem = 1200px,
  `--breakpoint-dt`). One Tailwind token must not contain contradictory
  utilities for the same property.
- Both root layouts (`(english)/layout.tsx`, `(localized)/[locale]/layout.tsx`)
  render the shared `components/layout/RootShell.tsx`; pages provide their own
  `<main id="main">`. Never add `app/layout.tsx` or page-level
  `generateStaticParams` for `[locale]`.
- Route `page.tsx` files export only their default component and supported Next.js
  route exports. Shared page components live under `components/pages/`; English
  and localized wrappers import them there, never from another route file.
- CSS Modules are being retired page by page. Migrate a page, verify visuals,
  then delete that page's module; final removal happens in the cleanup phase.
- Localization: missing keys fall back to English (`content/i18n.ts`).
  `content/translations.ts` is the only source of locale completeness and must be
  truth-keeping before deploy. A route/locale is complete only when every key it
  renders — `routeRequiredKeys[route]` PLUS `sharedRequiredKeys` (Nav, Footer,
  CTA, shared metadata) — exists in that catalog. `scripts/check-translations.mjs`
  enforces this; locales relying on `...en` spread do not count as complete.
- Visual regression: `tests/visual.spec.ts` is opt-in (`RUN_VISUAL=1`) and runs
  against the pinned CI renderer (Ubuntu + bundled Chromium). Baselines are
  platform-suffixed. Refresh them in that environment:
  `RUN_VISUAL=1 npx playwright test tests/visual.spec.ts --update-snapshots`.
  macOS machines run the functional suite (`npm run test:browser`) only.

- Homepage temporary mockups are explicitly approved. Follow `DESIGN.md`; use fixed native artboards via `MockupCanvas` and the separate mobile composition. Compare with the Claude export before refreshing visual baselines.
