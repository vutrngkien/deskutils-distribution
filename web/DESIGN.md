# DeskUtils website design direction

The approved visual reference is `/Users/vukien/workspace/DeskUtils Homepage Concepts/DeskUtils Homepage v2.dc.html`, including its separate desktop 1440 and mobile 390 frames. Feature pages use the corresponding `Site v1 - *` exports.

Use Tailwind v4 and daisyUI 5 with Geist and Lucide. Match the source composition, typography, spacing, colors, and visual scale; generic daisyUI defaults are not the design reference. Use `75rem` for the 1200px `dt` breakpoint so Tailwind sorts it consistently with its rem breakpoints.

Temporary Claude product mockups are explicitly approved until real captures are supplied. Components live under `components/mockups/`. `MockupCanvas` preserves native artboard dimensions and scales all text, icons, and geometry together. Mobile follows its own composition and deliberate crops from the source.

`ProductVisual` prefers generated media, then the approved mockup. Published homepage media must not be blank. See MEDIA.md for replacement instructions.

Feature facts, permissions, and compatibility come from the DeskUtils app source. Pricing and checkout come from `content/product.ts`, including the confirmed $7.99 launch / $14.99 regular offer. Published routes come from `content/routes.ts`. SEO and locale completeness remain governed by their existing registries.

Review rendered regions against the approved Claude export at identical viewport sizes before updating visual baselines. A passing regression comparison records stability, not design acceptance. Keep deliberate differences for real pricing, real FAQs, Lucide icons, and unpublished routes documented.

## Review adjustments

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
- Pricing states the lifetime license once beside the price. Display dimming
  is a Free preview while the menu is open; persistent dimming requires Pro.
- The launch-price FAQ is omitted because the pricing footnote already explains
  the offer. Locale FAQ and plan copy follow the same product facts.
- Historical macOS visual baselines predate this approved copy refinement.
  Refresh visual references in the pinned Linux/Chromium environment described
  in AGENTS.md; local macOS validation uses functional tests and manual screenshots.
