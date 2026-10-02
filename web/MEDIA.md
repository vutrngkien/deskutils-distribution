# Product visuals and replacement media

Temporary Claude mockups are approved for the homepage. `ProductVisual` resolves generated AVIF/WebP/PNG variants first, then its temporary mockup child. Published homepage slots must not fall back to a blank placeholder. `MediaSlot` still provides placeholders for pages without an approved visual.

`content/media.manifest.json` declares the real-media slots. `MockupCanvas` scales decorative HTML on a fixed artboard through SVG; it needs no resize JavaScript. Capture Text and utility scenes follow the separate mobile composition in the approved export. Mockups are outside the accessibility tree and tab order; the surrounding content explains each feature.

Pipeline (`npm run prepare:media`, run by `dev`/`build` before Next):

1. Cleans **only** `public/media/` (generated output).
2. Reads masters from `web/media-src/<master>` (gitignored, except the approved
   `hero.png`, `screenshot-hero.png`, `screenshot-menu.png` and `color-picker-panel.png`, which are versioned so remote builds
   include the real images). Color Picker uses the supplied 738×570 transparent
   panel unchanged, generating 369×285 and 738×570 variants for the homepage and
   feature page.
   Screenshot detail uses the prepared 2196×1539 image unchanged, generating
   1098×769 and 2196×1538 variants. It retains the complete supplied composition
   and transparency, without cropping, zooming or an added frame background.
   Screenshot Capture modes uses `screenshot-menu.png` (1050×1498), a transparent
   panel extracted with built-in ImageGen from the supplied app screenshot.
   Prompt: extract only the Screenshot submenu and its shadow; remove wallpaper,
   menu bar and desktop text; preserve panel content, icons and shortcuts.
   The static image replaces the mockup and its hover highlight.
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
`DemoMedia` is shared by Clipboard, Screenshot and Capture Text sections.
The Screenshot detail Annotate section reuses the homepage's `demos.screenshot`
recording, with a 25:16 frame and a cover crop. Its existing desktop-only layout
is retained, alongside the annotation tool descriptions.
Quick Access uses `public/videos/quick-access-demo.mp4`, a web export of the
supplied `quickaccess.mp4` (8.764 seconds, 1920×1200). The existing 30:19 frame
uses a cover crop. Its poster is taken at 3 seconds, with the Quick Access
buttons visible; shared playback and reduced-motion behavior come from `DemoMedia`.

The Features page's three featured cards reuse the Screenshot, Clipboard and
Quick Ring recordings from `demos`. The compact cards share a 16:10 media frame
and sit in one row on desktop. Clipboard uses a fixed 1.25× crop toward the list;
Quick Ring uses a 1.5× crop and its
open-ring poster for loading, reduced motion and playback failure. No duplicate
recording files or page-specific video URLs are needed.

Put recordings in `web/public/videos/`. Keep existing public assets under
`site/assets/`; the preparation script copies them without changing their URLs.

Capture Text uses `public/videos/capture-text-demo.mp4`, a compressed H.264 web
export of `deskutils_onboarding_demo_video/ocr.mp4` (3360×2100, 13.7s). The web
recording (about 5.6 MB, target 4 Mbps) and its updated `capture-text-poster.webp`
are 1920×1200. Both the homepage
and detail page use `demos.captureText`, with muted inline looping playback and
the shared reduced-motion/failure behavior. On the homepage, the desktop video
fills the remaining card height with a 16px gap below the copy; mobile keeps
the native 8:5 frame. Video and poster use a fixed 1.42× crop, anchored at
64% horizontally and 60% vertically. The crop does not change with playback.
The detail page uses a mild 16:9 crop. Video and poster share the crop. The
recording includes its own zoom animation.

The homepage Clipboard section uses the existing `clipboard-demo.mp4` with
`clipboard-poster.webp` extracted from the same recording. The source stays
1280×800; `.home-clip-recording` crops it inside the existing 520px desktop and
310px mobile frames. Desktop keeps the preview and list together; mobile zooms
into the list and search controls. Video and fallback poster use the same crop.
The Clipboard Manager detail hero reuses that recording in its original 21:13
frame, with a fixed 1.45× crop anchored at 50% horizontally and 33% vertically.
The video and reduced-motion/failure poster share this crop. The hero has no
outer padding or background frame.

The homepage and Quick Ring detail hero share `QuickRingRecording` and
`public/videos/quickring-demo.mp4` (H.264,
1396×994, 7.82 seconds). `quickring-start.webp` shows the empty first scene while
loading; `quickring-poster.webp` shows the open ring for Reduce Motion or failure.
All files are versioned so remote builds include them. `QuickRingRecording` crops
the video into the existing desktop/mobile frame. Its single Command key reads
the video clock; `quickRingCommandPresses` in `content/product.ts` defines the
two press intervals immediately before the ring appears at 0.75 seconds.
Playback resets offscreen, in hidden tabs and with Reduce Motion; Reduce Motion
and playback failures display the poster. Replacing the clip also requires
reviewing those timing intervals.

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

The Clipboard Manager detail page uses `search-demo.webp` (1094×771),
`clipboard_filter.webp` (1200×1217) and `quickpreview-demo.webp` (1094×771)
from `site/assets/images/` for Search, Pin & filter, and Preview. Each still
keeps its source aspect ratio with no crop or zoom so the full panel remains
visible. These stills have no outer padding or background frame. The hero
continues to use the homepage Clipboard recording.

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
