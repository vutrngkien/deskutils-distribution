# DeskUtils website design direction

`DeskUtils Landing Page.pdf` is a wireframe, not an approved visual design.
It is background context for the product sections and media slots. The current
page deliberately simplifies and reorders it; do not restore its section order,
palette, headings or content density as a design requirement.

The primary reference is [OneMenu](https://coffeebreak.software/one-menu/):
plain feature names, one useful sentence, a clear view of the product, then the
next utility. Use that clarity without copying its brand, device mockups or
customer claims.

## DeskUtils visual identity

- White canvas, charcoal text and buttons, cobalt utility icons drawn from the
  existing app icon. Pale blue is reserved for media surfaces and interaction.
- A compact icon-and-name hero with one literal explanation and a download.
  The small utility index is functional navigation, like a Mac tool palette.
- Clipboard leads because it has real media. Each image appears once; do not
  assemble an invented desktop out of repeated screenshots.
- Short alternating feature layouts, modest type sizes, quiet separators and a
  compact six-item screenshot grid that follows the annotate demo.
  No all-caps editorial eyebrows, numbered sections, glow, gradient text,
  repeating marketing cards, or separate native/privacy slogans.
- Pricing keeps a quiet Free column beside a dark DeskUtils Pro upsell. The
  Pro card is informational only: it says “Coming soon” and does not suggest a
  checkout is open.
- Video slots remain ready for real recordings. Missing media uses an honest,
  compact placeholder with a tool icon; it is not a simulated app or fake player.

## Source of truth

- Feature availability, permissions and system requirements: the private
  DeskUtils source app and the verified release artifact.
- Public pricing and license wording: `content/product.ts`, subject to the
  Lemon Squeezy configuration and release checklist.
- Layout and visual styling: the implemented responsive components and the
  simple product-first direction above.
- Media: existing DeskUtils captures plus recordings added through `MEDIA.md`.

If the wireframe and the shipped app disagree, update the website content to
match the shipped app and preserve the wireframe's layout intent only when it
still serves the user.
