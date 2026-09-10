# Add demo recordings

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

The Preview and Search stills are generated from their PNG source captures at
build time as top-aligned 1094×771 WebP files, each capped at 350 KB. The
build also generates the small WebP app icon used in the interface; keep the
PNG source in `site/assets/images/` for release assets and social media.

Before release, refresh the older menu-bar screenshot so the visible app matches
the newly released screenshot tools and dimming behavior. Do not present an older
screenshot as evidence that the release has been verified.
