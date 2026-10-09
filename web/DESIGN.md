# DeskUtils website design direction

The approved visual reference is `/Users/vukien/workspace/DeskUtils Homepage Concepts/DeskUtils Homepage v2.dc.html`, including its separate desktop 1440 and mobile 390 frames. Feature pages use the corresponding `Site v1 - *` exports.

Use Tailwind v4 and daisyUI 5 with Geist and Lucide. Match the source composition, typography, spacing, colors, and visual scale; generic daisyUI defaults are not the design reference. Use `75rem` for the 1200px `dt` breakpoint so Tailwind sorts it consistently with its rem breakpoints.

Temporary Claude product mockups are explicitly approved until real captures are supplied. Components live under `components/mockups/`. `MockupCanvas` preserves native artboard dimensions and scales all text, icons, and geometry together. Mobile follows its own composition and deliberate crops from the source.

`ProductVisual` prefers generated media, then the approved mockup. Published homepage media must not be blank. See MEDIA.md for replacement instructions.

Feature facts, permissions, and compatibility come from the DeskUtils app source. Free distribution and the optional Ko-fi support URL come from `content/product.ts`. The supplied Snapzy reference guides the free/support section: three flat cards for the free toolkit, voluntary support, and the official Ko-fi tip panel. Keep DeskUtils feature claims accurate; donations do not unlock features. The direct card renders the official 712px Ko-fi tip panel inside a compact keyboard-accessible scroll region that fills the remaining card height. There is no separate link below the panel. The community checklist groups all twelve tools; the supporter checklist explains voluntary contributions without promising extra features. The shared shell loads the supplied floating overlay once, using “Support me”, #00b9fe and white text. Do not add GitHub sponsorship or open-source claims. Published routes come from `content/routes.ts`. SEO and locale completeness remain governed by their existing registries.

Review rendered regions against the approved Claude export at identical viewport sizes before updating visual baselines. A passing regression comparison records stability, not design acceptance. Keep deliberate differences for real pricing, real FAQs, Lucide icons, and unpublished routes documented.

## Review adjustments

- Free & Support follows the user-approved “Site v1 - Free and Support” design
  viewed in Chrome on 2026-10-09. Its heading retains the shared 46px/30px
  landing-page scale, separate description and blue eyebrow, now visible on
  mobile too. The community goal sits below that heading and above the cards.
  It uses a compact centered composition, pale blue surface, white Apple SVG
  tile, 30px/24px goal heading, and black progress fill on a gray track. The
  fill animates for 1.1 seconds unless Reduce Motion is enabled. The Apple SVG
  renders across platforms without relying on a private system-font glyph.
  `public/images/apple-logo.svg` preserves the exact path from the Apple logo
  in [apple.com](https://www.apple.com/) global navigation, retrieved 2026-10-09.
  Only its viewBox is cropped to remove navigation-bar padding.
  Cards have 24px corners; buttons keep 12px corners. The download button is
  white with ink text and a light border; Ko-fi is #D93645 with white text and
  #C62828 on hover. Desktop retains the official widget in its own scroll area.
  Mobile uses two concise cards and the full-width goal CTA; the detailed
  toolkit remains available elsewhere on the homepage and on the pricing route.
  The pricing route uses the same goal and cards beneath its existing header.
- `content/notarization.ts` holds the creator-confirmed 99 USD first-year
  membership goal and 9% starting progress. Show the goal and percentage rather
  than inferring dollars raised from that percentage. The current snapshot
  remains available without JavaScript or when sync fails. The optional public
  endpoint connects the panel to `kofi-sync`; no credentials enter the website
  bundle. The design's sample $20 and 20% are not production values. Do not
  describe DeskUtils as already notarized.
- Homepage FAQ retains seven real answers. Subscription and license duration
  share one answer; rows keep Claude's dividers and plus/minus affordance. Native named details provide an exclusive accordion
  that also works without JavaScript.
- The three trust cards below the hero are omitted: macOS/version and Free are
  already in the download copy and Pricing, while local OCR is stated in Capture
  Text. This keeps the first screen compact.
- Navigation uses Features, Install, Pricing, Feedback and Changelog. Pricing
  targets the homepage section while its route is gated; Changelog targets the
  existing GitHub Releases URL.
- Quick Ring and utility mockups repeat the Claude motion timing, pause outside
  the viewport and honor Reduce Motion. Dimming uses a dark overlay on an opaque
  display rather than lowering the display's opacity. The compatibility note
  stays below the External Display Only description.

## Social proof and app gauge refinement

- The compact CSS marquee immediately after the hero uses four verbatim excerpts
  verified in the owner's r/MacStack thread on 2026-10-02. `content/social-proof.ts`
  stores each comment once with its exact comment permalink. Every card opens that
  comment in a new tab with noopener/noreferrer. No ratings or review structured
  data are inferred from these comments.
- The equal-width duplicate group exists only for seamless looping. Its links
  remain clickable but are hidden from accessibility APIs and keyboard tab order.
  Hover pauses; visible keyboard focus and Reduce Motion switch to a static,
  horizontally scrollable original group. Pointer focus must not hide a clicked
  duplicate before the browser can open its link.
- Gauge geometry follows `DeskUtils/Modules/SystemMonitoring/Menu/SystemMonitoringHeaderView.swift`:
  60pt circle, 5pt rounded green stroke, icon above the small label inside the
  ring. Hover replaces the icon with a 13pt rounded percentage. Keyboard focus
  and touch can reveal the same value. Shared by the monitoring card and hero
  menu mockup.
- Mouse Jiggler uses the exact filled rounded arrow_selector_tool path from the
  Material Symbols asset used by the Claude export, rather than an approximation.

## Approved homepage copy refinement

- Retain all three Screenshot modes and keyboard shortcuts on the homepage.
- Clipboard uses three concise benefit lines; Quick Ring uses one instruction
  and its animated illustration instead of repeating eight action names.
- Pricing presents the full free toolkit and voluntary support. Display dimming
  and every other tool are included for everyone.
- Pricing FAQs cover free use and optional donations. Locale FAQ and card copy
  follow the same product facts.
- Historical macOS visual baselines predate this approved copy refinement.
  Refresh visual references in the pinned Linux/Chromium environment described
  in AGENTS.md; local macOS validation uses functional tests and manual screenshots.
