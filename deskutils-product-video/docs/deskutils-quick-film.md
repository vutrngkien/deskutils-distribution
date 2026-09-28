# DeskUtils Quick Film — 42-Second Quick Introduction Film Spec

Status: **approved sequence**, production plan. Companion technical document:
[`native-capture-plan.md`](./native-capture-plan.md).

## 1. What this is

A 42-second quick introduction film for DeskUtils, assembled in this Remotion
project from **real native macOS app footage**. This document defines the
creative sequence, timing, captions and finishing rules. It does not define the
capture mechanics (see the native capture plan) and it does not contain app UI
recreated in code.

## 2. Hard constraints

- **Real native app footage only.** Every product demonstration is captured from
  the running DeskUtils macOS app. No web/website recording is used as app
  footage.
- **No recreated UI.** Remotion may crop, scale, pan, zoom and transition the
  captured footage. It must not rebuild panels, menus, toasts or controls.
- **No edits to DeskUtils.** Capture uses launch flags and preseeded local
  fixtures only.
- **Fictional local demo data only.** No real clipboard items, names, files,
  emails, URLs, screenshots or metrics from any person.
- **Two Remotion cards are allowed:** a privacy message card and the final end
  card. They are message cards, not recreated DeskUtils UI. Every product
  demonstration is still native footage.
- **Privacy claims must be true and sourced** from verified shipped copy (see
  Shot 6a).
- This project currently defines **no scenes, no compositions and no render**;
  it is the finishing/assembly layer.

## 3. Format and timeline

| Property | Value |
|---|---|
| Duration | 42 s |
| Frame rate | 30 fps → **1260 frames** |
| Aspect ratio | 16:9 |
| Master resolution | 2560×1440 (downscale to 1920×1080 on export) |
| Audio | Optional light music bed; no narration required (see §6) |
| Captions | Burned-in short captions per beat, safe-area aware |
| Footage source | `public/footage/deskutils-*.mov` (see capture plan §7.5) |

### Approved sequence and time budget

| # | Beat | Start | End | Frames | Role |
|---|---|---|---|---|---|
| 1 | Menu bar hero | 0:00 | 0:05 | 0–149 | Establish: one menu bar app |
| 2 | Clipboard History | 0:05 | 0:13 | 150–389 | Everyday copying |
| 3 | Capture Area + OCR | 0:13 | 0:21 | 390–629 | Capture and extract text |
| 4 | Quick Ring | 0:21 | 0:27 | 630–809 | Fast radial access |
| 5 | Color Picker / Prevent Sleep / System Monitoring | 0:27 | 0:36 | 810–1079 | Utilities breadth |
| 6 | Privacy message + Remotion end card | 0:36 | 0:42 | 1080–1259 | Trust → download |

---

## 4. Shot-by-shot creative direction

Each shot lists the native surface, the intended action, and the suggested
caption. Captions are short and appear near the bottom-center safe area unless a
shot needs a different treatment.

### Shot 1 — Menu bar hero (0:00–0:05)

- **Surface:** DeskUtils status item and the menu popover (`MenuBarView`), with
  System Monitoring gauges at the top and the tool list below.
- **Action:** cursor glides to the status item and clicks; the popover opens with
  a soft spring. Hold long enough to read the tool list.
- **Framing:** start full-frame desktop (clean wallpaper), then a gentle push-in
  toward the menu bar; no hard cut.
- **Caption:** `Small tools. Right where you need them.`
- **Note:** capture happens with a Pro license active for the OCR beat, so the
  `Get DeskUtils Pro` capsule is absent. Do not show the system clock or
  third-party menu bar icons; mask in post if unavoidable.

### Shot 2 — Clipboard History (0:05–0:13)

- **Surface:** the centered clipboard panel (572×820).
- **Action:** open with `⌘⇧V`; scroll the seeded list; tap a type filter; type a
  short search; hover a card to reveal actions; `⌥Space` preview; press Enter to
  paste. Show pinned and image/link items.
- **Framing:** open centered, then a slow 5–8% push-in on search + preview.
- **Caption:** `Everything you copied, ready to reuse.`
- **Data:** only the fictional seeded items from the capture plan (§5.2).

### Shot 3 — Capture Area + OCR (0:13–0:21)

- **Surface:** the dimmed region-selection overlay (real overlay, enabled by
  `--demo-mode`) and the OCR result toast.
- **Action:** (a) trigger Capture Area over the fixture document and drag a clean
  rectangle; (b) trigger Capture Text and drag over a paragraph; the toast
  confirms the copied text.
- **Framing:** show the full overlay with the selection dimensions; then a tight
  crop on the OCR selection and toast.
- **Caption:** `Capture a region. Copy the text inside it. · Pro`
- **Data:** fixture document with clearly readable, fictional text.
- **Note:** OCR recognition runs locally with Apple Vision. Network is needed
  only once beforehand to activate a sandbox/test Pro license, not for the OCR
  capture itself.

### Shot 4 — Quick Ring (0:21–0:27)

- **Surface:** the Quick Ring radial panel with its eight shipping slots.
- **Action:** double-`⌘` opens the ring; move the pointer around the ring so
  slots highlight; settle on one and release to execute. Prefer a benign,
  visually clear slot for the highlight (e.g. Clipboard or Screenshot History).
- **Framing:** centered on the ring, slight pull-back to reveal the desktop
  context; keep the pointer visible but unobtrusive.
- **Caption:** `Your daily tools, one gesture away.`
- **Data:** default shipping layout only (Free/non-Pro).

### Shot 5 — Color Picker / Prevent Sleep / System Monitoring (0:27–0:36)

Three short beats sharing one visual rhythm (soft cross-dissolves, ~3 s each).
This shot is laptop-safe and needs only a single display.

- **5a Color Picker (0:27–0:30):** `⌘⇧C`, magnifier HUD samples a known color on
  the fixture poster, panel shows hex/RGB/HSL and Recent Colors.
  Caption: `Sample any color on screen.`
- **5b Prevent Sleep (0:30–0:33):** press `⌘⇧P` to toggle Prevent Sleep on; the
  status label reads `DeskUtils — Prevent Sleep is on` and a state toast
  confirms it. Toggle off before the next take.
  Caption: `Keep your Mac awake when you need it.`
- **5c System Monitoring (0:33–0:36):** menu header gauges; hover to reveal CPU /
  Memory / Disk percentages.
  Caption: `CPU, memory and disk at a glance.`
- **Data:** Prevent Sleep is a live session toggle with no fixture data; System
  Monitoring shows real metrics only; do not fabricate values.

### Shot 6 — Privacy message + Remotion end card (0:36–0:42)

- **6a Privacy message (0:36–0:39):**
  - Remotion message card using **only** this verified shipped copy:
    - `Your work stays yours.`
    - `Clipboard history stays on your Mac, and text recognition runs on device.`
  - This card is allowed; it is a message, not recreated DeskUtils UI. Do not add
    additional privacy claims.
- **6b End card (0:39–0:42):**
  - Clean Remotion end card with exactly:
    - `DeskUtils`
    - `Small tools. Right where you need them.`
    - `Download for free · deskutils.app`
  - Do **not** use the native `Get DeskUtils Pro` panel or any other native
    surface as the final beat.

---

## 5. Transitions and finishing

- **Palette of moves:** soft push-ins (3–8%), slow pans, cross-dissolves between
  utility beats, one clean cut into the privacy beat. Avoid flashy wipes.
- **Cursor:** allow the real cursor from capture (`screencapture -C`); do not
  draw a synthetic cursor.
- **Zooms:** crop into real pixels only. Never sharpen beyond 1.5× source scale.
- **Titles/captions:** a single typographic system across all beats; keep the
  menu bar and app chrome legible. Respect reduced-motion by keeping caption
  fades short. The privacy card and end card share the film's type system.
- **Color:** normalize all clips to one profile; keep wallpaper and appearance
  identical across shots.
- **Cut points:** snap to the timeline in §3; keep at least 6 frames of handle on
  each clip for dissolves.

## 6. Music and audio

- Optional calm, minimal electronic bed at low volume; duck under any (optional)
  voiceover.
- If narration is added later, add a caption track and transcript first
  (mirrors the site media rule in `web/MEDIA.md`).
- Capture itself is silent (`screencapture -x`); no app audio is needed.

## 7. Deliverables and non-goals

**Deliverables (later, not now):**
- 42 s 16:9 master, 1920×1080 H.264 MP4 (and optionally a 2560×1440 master).
- Per-beat trimmed clips retained for re-edits.
- Poster frames per beat.
- The two Remotion cards (privacy message and end card) as part of the master.

**Non-goals (this task):** no Remotion scenes, no compositions, no rendering, no
DeskUtils modifications. This document plus `native-capture-plan.md` are the only
artifacts of this phase.

## 8. Acceptance criteria

- [ ] Every product demonstration is real native DeskUtils footage, 16:9, no
      web recording, no recreated UI (the two approved message/end cards are the
      only non-footage beats).
- [ ] Total runtime is 42 s ±1 frame and beats match the §3 budget.
- [ ] Clipboard items, documents, colors and any names are clearly fictional.
- [ ] The privacy card uses only the approved shipped copy (§Shot 6a); no
      additional privacy claims.
- [ ] The final beat is the Remotion end card with the exact approved lines
      (§Shot 6b); the native `Get DeskUtils Pro` panel is not used.
- [ ] The OCR beat is captioned `Capture a region. Copy the text inside it. · Pro`
      and the recognition is local.
- [ ] All beats work on a laptop with a single display (no external-display
      dependency).
- [ ] No real user data, system clock, username or personal files appear;
      anything unavoidable is masked.
- [ ] All clips share one appearance, accent color, wallpaper and Reduce Motion
      setting.
- [ ] Capture plan risks A–P reviewed and resolved or accepted before recording.

## 9. Open questions for the approver

1. Should System Monitoring values be shown as-is or masked behind neutral
   labels for reproducibility?
