# Product visuals and replacement media

Temporary Claude mockups are approved for the homepage. `ProductVisual` resolves generated AVIF/WebP/PNG variants first, then its temporary mockup child. Published homepage slots must not fall back to a blank placeholder. `MediaSlot` still provides placeholders for pages without an approved visual.

`content/media.manifest.json` declares the real-media slots. `MockupCanvas` scales decorative HTML on a fixed artboard through SVG; it needs no resize JavaScript. Capture Text and utility scenes follow the separate mobile composition in the approved export. Mockups are outside the accessibility tree and tab order; the surrounding content explains each feature.

Pipeline (`npm run prepare:media`, run by `dev`/`build` before Next):

1. Cleans **only** `public/media/` (generated output).
2. Reads masters from `web/media-src/<master>` (gitignored).
3. Validates that each master's aspect ratio matches its slot (within 1%) and
   rejects mismatches, so screenshots are resized with `contain` — never cropped
   with `cover`. It emits AVIF (q≈50), WebP (q≈82) and PNG variants at 1x and 2x,
   never upscaling, and verifies each variant's dimensions.
4. Missing masters are skipped (approved homepage mockups remain).

`MediaSlot` renders a responsive `<picture>` (AVIF → WebP → PNG, 1x/2x) with
explicit `width`/`height` and `data-media-state="ready"` when variants exist, and
an honest placeholder with `data-media-state="placeholder"` otherwise. Only the
hero is eager/`fetchpriority="high"`; everything below the fold is lazy.

It never touches `site/` distribution assets, `appcast.xml` or `CNAME`. Add a
master at 2x the declared slot size to satisfy the generator.

## Add demo recordings

Edit `content/product.ts`; the `demos` object is the only media configuration.
`DemoMedia` is shared by clipboard and screenshot sections. OCR is represented
in the screenshot capability grid and has no separate demo slot.

Put recordings in `web/public/videos/`. Keep existing public assets under
`site/assets/`; the preparation script copies them without changing their URLs.

For short, silent demos that should autoplay and loop without a media player,
use an MP4 source and set `autoplay: true`:

```ts
clipboard: {
  title: 'Clipboard Manager',
  description: 'DeskUtils clipboard history with search, pinned items and content filters.',
  poster: '/assets/images/clipboard_search.webp',
  posterWidth: 1200,
  posterHeight: 758,
  sources: [{ src: '/videos/clipboard-demo.mp4', type: 'video/mp4' }],
  aspectRatio: '8 / 5',
  autoplay: true,
},
```

```ts
screenshot: {
  title: 'Screenshot & annotation',
  description: 'Capture a region and annotate it in DeskUtils.',
  poster: '/videos/screenshot-poster.webp',
  posterWidth: 1600,
  posterHeight: 900,
  sources: [
    { src: '/videos/screenshot.webm', type: 'video/webm' },
    { src: '/videos/screenshot.mp4', type: 'video/mp4' },
  ],
  aspectRatio: '16 / 9',
},
```

Use actual DeskUtils captures with sample, non-sensitive content. Record short,
silent demonstrations (roughly 10–25 seconds) with readable interface text. Export
MP4 using H.264 for Safari compatibility; optional WebM can reduce transfer size.
Keep the poster and video at the same aspect ratio, preferably under 10 MB per clip.
Explain the action in the adjacent text so the demo is not the sole source of
information. If adding narration later, add a caption track and transcript first.

- No sources: a real poster or the intentional “Demo coming soon” placeholder.
- Sources present: native controls, inline playback, no autoplay, preload none.
- `autoplay: true`: muted inline playback, loops without controls, waits until
  it is near the viewport, and pauses when reduced motion is requested or it
  scrolls away.
- Playback failure: poster/placeholder plus a short error message.
- Replacing a source needs a rebuild, but no component or CSS changes.

The Preview and Search stills live in `site/assets/images/` as top-aligned
1094×771 WebP files, each capped at 350 KB. The build generates the small
WebP app icon used in the interface; keep its PNG source in
`site/assets/images/` for release assets and social media.

Before release, refresh the older menu-bar screenshot so the visible app matches
the newly released screenshot tools and dimming behavior. Do not present an older
screenshot as evidence that the release has been verified.

## Screenshot tab recordings

Put the three recordings in `web/public/demos/`:

- `screenshot-capture.mp4` (or `.webm`)
- `screenshot-annotate.mp4` (or `.webm`)
- `screenshot-save.mp4` (or `.webm`)

Use the existing 25:16 stage ratio. Both formats can coexist (WebM then MP4).
These files are outside the generated `public/media/` directory and survive
`prepare:media`. The build includes only recordings that exist. Missing or
failed recordings retain the Claude mockup; there are no empty stages.

A recording plays muted inline when its stage is visible. Ending it selects
the next tab; Save returns to Capture. Clicking a tab stops the old recording.
Native controls allow pausing. Leaving the viewport or browser tab pauses it.
With Reduce Motion enabled there is no automatic playback; visitors can use
Play. No timer pretends that a missing recording has finished.
