# DeskUtils Native Capture Plan

Technical plan for capturing **real native macOS DeskUtils footage** for the
42-second quick introduction film. Companion document:
[`deskutils-quick-film.md`](./deskutils-quick-film.md) (creative sequence).

## Locked decisions (approved)

1. **Format:** a 42-second quick introduction film for DeskUtils.
2. **Final CTA:** a clean Remotion end card reading `DeskUtils` /
   `Small tools. Right where you need them.` /
   `Download for free · deskutils.app`. The native `Get DeskUtils Pro` panel is
   **not** the final beat.
3. **OCR stays**, captioned `Capture a region. Copy the text inside it. · Pro`.
   Recognition runs locally with Apple Vision; network is needed only once to
   activate a sandbox/test Pro license, not for the OCR capture itself.
4. **Prevent Sleep replaces External Monitor Brightness** so the film works
   reliably on a laptop with a single display.
5. **Privacy title card** uses only verified shipped copy:
   `Your work stays yours.` /
   `Clipboard history stays on your Mac, and text recognition runs on device.`
6. **Native-app footage for all product demonstrations.** A Remotion end card and
   privacy message card are allowed; DeskUtils UI is never recreated.

## 0. Purpose, scope and guardrails

- **Source inspected read-only:** `/Users/vukien/workspace/DeskUtils` (Xcode
  project, app source, tests, docs). No DeskUtils file was edited, built,
  launched, or installed while producing this plan.
- **This plan contains build/launch/permission commands for a later, explicitly
  approved capture session.** None of them are run from this Remotion project
  automatically.
- **DeskUtils remains unmodified.** All determinism comes from launch flags,
  preseeded `UserDefaults`/data files, and external UI scripting.
- **No web recording and no recreated UI.** Native app windows/overlays are
  captured by the OS; Remotion only assembles, crops, zooms and adds the
  approved privacy and end cards (locked decisions 2 and 5).
- **Fictional local demo data only.** No real clipboard contents, names, files,
  emails, URLs or metrics from a real person.

Target platform: the machine used for the current Xcode version referenced by
the project (Xcode 26.4.1+, macOS 26 for the Liquid Glass path; fallback path on
macOS 15). `MACOSX_DEPLOYMENT_TARGET = 15.2`.

---

## 1. Exact Xcode scheme and safe build command

### Schemes available (`DeskUtils.xcodeproj/xcshareddata/xcschemes/`)

| Scheme | Build config | Launch config | Injects `--demo-mode`? | Use for capture |
|---|---|---|---|---|
| `DeskUtilsDev` | Debug | Debug | **Yes** (`DeskUtilsDev.xcscheme:54-59`) | **Primary** |
| `DeskUtilsBeta` | Beta | Beta | No (pass manually) | Alternative (BETA build) |
| `DeskUtils` | Debug/Beta/Release | **Release** | No | Avoid for overlay shots (no demo mode) |

`--demo-mode` is compile-time gated to `DEBUG || BETA`
(`DeskUtils/Core/UI/OverlayCaptureSharing.swift:15-21`); it is ignored in a
Release binary. Use a **Debug or Beta binary**.

### Safe build command (isolated output, no repo writes)

Run from `/Users/vukien/workspace/DeskUtils`:

```bash
# 1. Resolve pinned SwiftPM deps (safe, read-only against the repo)
xcodebuild -resolvePackageDependencies \
  -project DeskUtils.xcodeproj -scheme DeskUtilsDev

# 2. Build the demo-capable Debug app outside the repo
xcodebuild -project DeskUtils.xcodeproj -scheme DeskUtilsDev \
  -configuration Debug \
  -destination 'platform=macOS' \
  -derivedDataPath /tmp/DeskUtilsCapture \
  build
```

**Signing recommendation:** the command above lets normal automatic signing run
(team `U84L24L5J3`), which produces a signed `.app` whose TCC grants
(Accessibility / Screen Recording) persist across relaunches. The CI-style
variant `CODE_SIGNING_ALLOWED=NO` is safe but yields an **unsigned** app;
macOS TCC keys grants by code identity/path and is fragile for unsigned builds,
so it is **not** recommended for a multi-shot capture pass (see §8 risk E).

The build writes only to `/tmp/DeskUtilsCapture`. It does not modify the
DeskUtils repository.

---

## 2. Expected built app path and bundle identifier

| Item | Value | Source |
|---|---|---|
| App bundle | `/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app` | `<derivedDataPath>/Build/Products/<config>/DeskUtils.app`; matches `Scripts/release/build_artifacts.sh:218` |
| Executable | `.../Contents/MacOS/DeskUtils` | `PRODUCT_NAME = $(TARGET_NAME)` |
| Embedded helper | `.../Contents/MacOS/DeskUtilsDisplayRecovery` | `project.pbxproj` helper target |
| App bundle id | `com.kienvt.DeskUtils` | `project.pbxproj:532,575,681`; `Config/DeskUtils-Info.plist:9-10` |
| Helper bundle id | `com.kienvt.DeskUtils.DisplayRecovery` | `project.pbxproj:354` |
| Test bundle id | `com.kienvt.DeskUtilsTests` | `project.pbxproj:599` |
| URL scheme | `deskutils` | `Config/DeskUtils-Info.plist:15-25` |
| App kind | `LSUIElement = true` (menu-bar agent, no Dock) | `Config/DeskUtils-Info.plist:38-39` |

Launch for capture (deterministic argument passing):

```bash
# Preferred: run the inner executable directly so --demo-mode is guaranteed
"/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/MacOS/DeskUtils" \
  --demo-mode &
```

Alternatively `open -n "/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app" --args --demo-mode`.

Validate the built product before capture:

```bash
/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' \
  "/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/Info.plist"
# expect: com.kienvt.DeskUtils
codesign -dv "/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app" 2>&1 | head
```

---

## 3. UI automation approach

### 3.1 Existing UI tests

There is **no XCUITest target and no UI test**. `DeskUtilsTests` is an XCTest
**unit**-test bundle (`com.apple.product-type.bundle.unit-test`,
`project.pbxproj:229-234`, `TEST_HOST` at `:602`). A repo-wide search for
`XCUIApplication`, `XCUIElement`, `XCUITest` and `addUIInterruptionMonitor`
returns nothing. Automation must therefore be external.

### 3.2 Accessibility identifiers

There are **no `.accessibilityIdentifier` / `setAccessibilityIdentifier` values
anywhere** in the app. Automation can only match on accessibility **labels**,
roles and geometry. Relevant, stable labels (file:line):

- Status item label: `"DeskUtils"` / `"DeskUtils — Prevent Sleep is On"`
  (`DeskUtils/App/DeskUtilsApp.swift:93`).
- Menu bar: `"Get DeskUtils Pro"` (`MenuBar/MenuBarView.swift:189`), screenshot
  submenu hint `"Opens screenshot commands"` (`:94`), back `"Returns to the main
  menu"` (`:227`), module rows use the module title (`:298`).
- Screenshot region overlay: `"Screenshot region selection"` plus help
  `"Drag to select a region. Press Escape to cancel."`
  (`Core/ScreenCapture/ScreenRegionSelectionView.swift:23-24`).
- Clipboard cards/type badges: `"Text"`, `"Image"`, `"File"`, `"Pinned"`
  (`Modules/Clipboard/Panel/Views/ClipboardVisualStyle.swift:63-70`); pin
  `"Pin"`/`"Unpin"` (`ClipboardCard.swift:92`).
- Quick Ring slots expose `state.accessibilityDescription` and hub labels
  (`Modules/QuickRing/Panel/QuickRingPanelView.swift:190-192,249-250`).
- System Monitoring gauges: `"CPU"`, `"Memory"`, `"Disk"` with `"NN%"`
  (`Modules/SystemMonitoring/Menu/SystemMonitoringHeaderView.swift:112-115`;
  `Domain/SystemMetrics.swift:35-41`).
- OCR result is a transient toast (`OCRToastResultReporter`,
  `Modules/OCR/Services/OCRCaptureServices.swift:26-54`), not a persistent
  element.

### 3.3 Keyboard shortcuts (global, KeyboardShortcuts library)

| Feature | Default | Trigger source |
|---|---|---|
| Clipboard panel | `⌘⇧V` | `ClipboardModule` shortcut |
| Capture Area | `⌘⌥⇧4` | `ScreenshotModule` |
| Capture Fullscreen | `⌘⌥⇧3` | Screenshot |
| Capture Previous Area | `⌘⇧8` | Screenshot |
| Quick Annotate | `⌘⇧7` | Screenshot |
| Scrolling Capture | `⌘⌥⇧6` | Screenshot |
| Capture Subject | `⌘⇧1` | Screenshot |
| Capture Smart Element | `⌥⇧4` | Screenshot |
| Capture Active Window | `⌘⌥⇧9` | Screenshot |
| Screenshot History | `⌘⇧H` | Screenshot |
| Capture Text (OCR) | `⌘⇧2` | `OCRModule` (Pro) |
| Color Picker | `⌘⇧C` | `ColorPickerModule` |
| Clean Keyboard | `⌘⇧K` | session toggle |
| Prevent Sleep | `⌘⇧P` | session toggle |
| Quick Ring | unassigned by default (double-`⌘` gesture) | `QuickRingModule` |
| External Display Only | unassigned | session toggle |

Global shortcuts are backed by a `CGEvent` tap and require Accessibility
(`Core/Shortcuts/GlobalShortcutCoordinator.swift`). Synthetic key events
delivered by `osascript`/`cliclick` are normally observed; verify once per
session. The film uses Clipboard `⌘⇧V`, Capture Area `⌘⌥⇧4`, Capture Text
`⌘⇧2`, Color Picker `⌘⇧C`, Prevent Sleep `⌘⇧P`, and the Quick Ring gesture.

### 3.4 Launch arguments and demo hooks

- **Only one launch argument exists: `--demo-mode`.** It flips DeskUtils overlay
  windows from `sharingType = .none` to `.readOnly`
  (`Core/UI/OverlayCaptureSharing.swift:24-30`) so the OS can record the real
  region-selection overlay, processing HUD, scrolling UI and Smart Element
  overlay. Applied at `Core/ScreenCapture/ScreenRegionSelectionController.swift:140`,
  `Modules/Screenshot/Capture/ScreenshotProcessingHUD.swift:21`,
  `Modules/Screenshot/Capture/SmartElement/SmartElementOverlayWindow.swift:68`,
  `Modules/Screenshot/Scrolling/ScrollingCaptureUI.swift:38,92`.
- **No runtime fake-data seeding exists.** Determinism is achieved by pre-seeding
  files/`UserDefaults` before launch and by `--demo-mode`.

### 3.5 Deep links (`deskutils://`) — most deterministic triggers

Registered in `Config/DeskUtils-Info.plist:15-25`; parsed in
`App/DeskUtilsDeepLinkHandler.swift:14-77`. Open with `open "deskutils://..."`.

| URL | Result |
|---|---|
| `deskutils://capture/fullscreen` | Screenshot fullscreen |
| `deskutils://capture/area` | Screenshot area selection |
| `deskutils://capture/repeat-area` | Repeat previous area |
| `deskutils://capture/application` or `.../window` | Capture application/window |
| `deskutils://capture/active-window` | Capture active window |
| `deskutils://capture/area-annotate` | Quick Annotate |
| `deskutils://capture/scrolling` | Scrolling capture |
| `deskutils://capture/text` or `.../ocr` | Capture Text (OCR) |
| `deskutils://capture/object-cutout` | Capture Subject |
| `deskutils://capture/smart-element` | Capture Smart Element |
| `deskutils://open/annotate` | Blank Full Annotate editor |
| `deskutils://open/combine` | Combine images |
| `deskutils://open/history` | Screenshot history |

Deep links cover the **capture** beats. Clipboard, Color Picker, Prevent Sleep,
Quick Ring and System Monitoring have **no** deep link and must be driven by
shortcut, menu click or (Quick Ring) the double-`⌘` gesture; Prevent Sleep uses
`⌘⇧P`.

### 3.6 Recommended automation stack

1. **Launch** the executable with `--demo-mode`.
2. **Seed** fixture data (§5) before launch.
3. **Drive** with a small shell/AppleScript driver:
   - `open "deskutils://..."` for capture/OCR/history.
   - `osascript` System Events or `cliclick` for the status-item click, menu
     rows, toggles, text entry and keystrokes.
   - `AXUIElement` queries against the label list in §3.2 where a reliable
     element is needed.
4. **Record** the whole display with `screencapture -v` (§7).

Do not add an automation target to DeskUtils. Keep all scripting outside the
parent repository.

---

## 4. Shot-by-shot mapping (approved sequence)

Global setup per shot: launch with `--demo-mode`, one display, Reduce Motion
off, Do Not Disturb on, analytics off, onboarding preseeded, and a sandbox/test
Pro license activated once for the OCR beat (network on only for that
activation). No non-Pro pass is required because the final beat is a Remotion
end card.

| # | Beat | Time | Trigger | Captured surface | Notes |
|---|---|---|---|---|---|
| 1 | Menu bar hero | 0:00–0:05 | Click DeskUtils status item | Status item + menu popover (`MenuBarView`) | Header gauges + tool list (Pro active, so no CTA capsule) |
| 2 | Clipboard History | 0:05–0:13 | `⌘⇧V` | `ClipboardFloatingPanel` 572×820 centered (`ClipboardPanelController.swift:43-59`) | List, filters, search, preview, paste |
| 3a | Capture Area | 0:13–0:17 | `deskutils://capture/area` (or `⌘⌥⇧4`) | Region selection overlay (`ScreenRegionSelectionView`) | Requires `--demo-mode` + Accessibility + Screen Recording |
| 3b | OCR | 0:17–0:21 | `deskutils://capture/text` (or `⌘⇧2`) | OCR selection overlay + result toast | **Pro**; recognition local (Apple Vision); toast transient |
| 4 | Quick Ring | 0:21–0:27 | Double-`⌘` (or alternate shortcut preseed) | `QuickRingPanel` radial menu | 8 fixed slots; menu-hidden module |
| 5a | Color Picker | 0:27–0:30 | `⌘⇧C` | Picking HUD + `ColorPickerView` panel | Screen Recording required |
| 5b | Prevent Sleep | 0:30–0:33 | `⌘⇧P` (or menu toggle) | Status label + state toast | Live session toggle; laptop-safe; no external display |
| 5c | System Monitoring | 0:33–0:36 | Open menu; hover gauges | `SystemMonitoringHeaderView` | Real live metrics only; no seeding |
| 6a | Privacy message | 0:36–0:39 | — | **Remotion message card** (see §5.7) | Allowed card; only approved shipped copy |
| 6b | End card | 0:39–0:42 | — | **Remotion end card** | `DeskUtils` / `Small tools. Right where you need them.` / `Download for free · deskutils.app`; no native Pro panel |

### Detail per shot

**Shot 1 — Menu bar hero.** Menu popover content (order depends on enabled
modules): header custom sections first (System Monitoring gauges), then standard
action rows (Clipboard, Color Picker, Quick Ring command, Screenshot submenu),
then session toggles (Clean Keyboard / Prevent Sleep / External Display Only),
then Check for Updates, Settings (`⌘,`) and Quit (`⌘Q`)
(`MenuBarView.swift:106-190`). Because the film captures with a Pro license
active, the `Get DeskUtils Pro` capsule is absent. Click via AX on the status
item labeled `DeskUtils`.

**Shot 2 — Clipboard History.** Open with `⌘⇧V`. Show scroll, type filters
(`⌘1` pinned, `⌘2` text, `⌘3` image, `⌘4` file), search (`F`) and preview
(`⌥Space`). Enter pastes. Panel is an `NSPanel` and is capturable as a normal
window.

**Shot 3 — Capture Area + OCR.** With `--demo-mode`, the real dimmed selection
overlay is recordable. Drag a region over the fixture document, then run OCR
over a text region. The OCR outcome is a short-lived toast
(`.ocrCopied`), so record with generous handles and catch it in the window.
OCR is `ProFeature.captureText`; recognition runs locally with Apple Vision, so
no network is needed for the capture. A sandbox/test Pro license must be
activated once beforehand (`LICENSE_ENVIRONMENT = test`). The caption labels
this beat `· Pro`.

**Shot 4 — Quick Ring.** `QuickRingModule` is a `DeskUtilsMenuHiddenModule`
(`QuickRingModule.swift:22`) — it does **not** appear in the menu popover, so it
must be opened by the double-`⌘` event tap (Accessibility) or by presetting the
alternate global shortcut. Shipping slots clockwise from up
(`Domain/QuickRingActionCatalog.swift:63-72`): Capture Area, OCR, Clipboard,
Prevent Sleep, Screenshot History, Clean Keyboard, Quick Annotate, Color Picker.
Note the ring hides itself before executing a capture so it is never captured in
a screenshot result — capture the ring as its own clip.

**Shot 5 — Color Picker / Prevent Sleep / System Monitoring.**
- Color Picker: `⌘⇧C` shows the magnifier HUD over the fixture poster, then the
  360-wide panel with hex/format and Recent Colors
  (`Modules/ColorPicker/Panel/ColorPickerView.swift:33`, `RecentColorsView`).
- Prevent Sleep: press `⌘⇧P` to toggle it on. The status label becomes
  `DeskUtils — Prevent Sleep is on` and a state toast appears
  (`App/AppCoordinator.swift:128-148`). It needs no external display and no
  fixture; toggle it off before the next take.
- System Monitoring: header gauges; hover swaps symbol for the rounded percent
  (`SystemMonitoringHeaderView.swift:85-107`). Values are real; there is no seed
  hook.

**Shot 6 — Privacy + end card.** The app has no native privacy screen, so 6a is
a Remotion message card built only from the approved shipped copy in §5.7; this
is explicitly allowed and is not a recreation of DeskUtils UI. 6b is a clean
Remotion end card (`DeskUtils`, `Small tools. Right where you need them.`,
`Download for free · deskutils.app`). Do **not** use the native
`Get DeskUtils Pro` panel as the final beat.

---

## 5. Fixture data (fictional local demo data only)

### 5.1 Pre-launch `UserDefaults` seeds (`com.kienvt.DeskUtils`)

```bash
defaults write com.kienvt.DeskUtils com.deskutils.onboarding.completedVersion -int 1
defaults write com.kienvt.DeskUtils com.deskutils.analytics.enabled -bool false
# Enable a known module set (only what the film shows)
defaults write com.kienvt.DeskUtils com.deskutils.enabledModules \
  -dict clipboard -bool true colorPicker -bool true ocr -bool true \
        screenshot -bool true systemMonitoring -bool true \
        externalDisplayDimming -bool false quickRing -bool true \
        cleanKeyboard -bool false preventSleep -bool true \
        externalDisplayOnly -bool false
```

> `OnboardingStore.currentVersion` is `1`
> (`Onboarding/OnboardingStore.swift:9`); seeding `1` skips the onboarding
> window that would otherwise cover the launch beat. `enabledModules` shape is
> `[moduleID: Bool]` (`Core/ModuleManager.swift:105`).

### 5.2 Clipboard history (`~/Library/Application Support/DeskUtils/`)

- `clipboard_history.json` (`ClipboardStorage.swift:29-35`) — JSON array of
  `ClipboardItem` (`Domain/ClipboardItem.swift:190-209`). Shape per item:

```json
[
  { "id": "<uuid>", "content": { "type": "text", "text": "DeskUtils demo: order DU-1042 is ready." },
    "date": 700000000, "isPinned": false,
    "sourceApplication": { "bundleIdentifier": "com.apple.Notes", "displayName": "Notes" } },
  { "id": "<uuid>", "content": { "type": "link", "text": "https://example.com/deskutils-demo" },
    "date": 699999000, "isPinned": true,
    "sourceApplication": { "bundleIdentifier": "com.apple.Safari", "displayName": "Safari" } },
  { "id": "<uuid>", "content": { "type": "image",
      "image": { "fileName": "demo-poster.png", "pixelWidth": 1200, "pixelHeight": 758, "byteCount": 180000 } },
    "date": 699998000, "isPinned": false,
    "sourceApplication": { "bundleIdentifier": "com.apple.Preview", "displayName": "Preview" } }
]
```

- Put the referenced image in `ClipboardImages/` (600 permissions on the JSON are
  set by the app). Use a synthetic gradient/poster you author, never real content.
- **Pollution control:** the Clipboard monitor captures the live pasteboard while
  the app runs. Do not copy anything real during capture. Prefer running shots
  2–6 in one session with the intended items pinned first, or drive from a clean
  user account.

### 5.3 Screenshot history (Shot 3 optional)

GRDB/SQLite at `~/Library/Application Support/DeskUtils/History/` plus
`Thumbnails/` (`Modules/Screenshot/History/ScreenshotHistoryStore.swift:25-40`).
Rows require real image files on disk (`add(_:capturedAt:)` throws
`artifactMissing`). Prefer letting the capture flow generate 2–3 history items
from the fixture document rather than hand-writing SQLite.

### 5.4 Color Picker recents

`colorPicker.recentColors` — JSON `[RecentColor]`, max 7, newest first
(`Modules/ColorPicker/Settings/ColorPickerPreferences.swift:16,67-89`). Seed
brand hexes (e.g. `#0A84FF`, `#30D158`, `#FF9F0A`, `#BF5AF2`) sampled from the
demo poster so the Recent Colors row looks intentional.

### 5.5 Quick Ring

`quickRing.doubleCommandEnabled` (default true), `quickRing.position`,
`quickRing.customLayout` (`Domain/QuickRingPreferences.swift:46-51`). Leave the
default shipping layout (8 slots, §Shot 4) for Free/non-Pro.

### 5.6 Screenshot output preferences (avoid writing to real Desktop)

Set automatic Save off and use PNG during capture so Quick Access stays in
`Application Support/DeskUtils/Captures`:
`screenshot.v1.afterCapture.*`, `screenshot.v2.afterCapture.openAnnotate`,
`screenshot.v2.capture.imageFormat`
(`Modules/Screenshot/Settings/ScreenshotPreferences.swift:10-51`). Otherwise the
app writes to `~/Desktop/DeskUtils` (`Modules/Screenshot/README.md`).

### 5.7 Privacy-beat copy (approved shipped copy only)

The privacy card may use **only** these verified shipped lines:

- `Your work stays yours.`
- `Clipboard history stays on your Mac, and text recognition runs on device.`

These are shipped product copy (`web/content/messages/en.ts`,
`homePrivacy.title` and `homePrivacy.local.description`). Do not add any other
privacy or data claim.

### 5.8 System Monitoring

No fixtures are possible. Metrics are read live via Mach APIs
(`Modules/SystemMonitoring/Services/MachSystemMetricsProvider.swift`). Plan to
accept real values or mask them in post.

### 5.9 Prevent Sleep

No fixture data is needed; it is a live session toggle. Ensure `preventSleep` is
enabled in the module set (§5.1), toggle it during the shot, and reset it to off
between takes.

---

## 6. macOS permissions required

Only **Accessibility** and **Screen Recording** are needed. Input Monitoring is
not declared or used (no `IOHIDRequestAccess` / `.listenOnly` taps); clipboard
direct paste uses Post-Event access, which macOS surfaces under the
**Accessibility** pane.

| Permission | TCC check / request | Features that trigger it |
|---|---|---|
| Accessibility | `AXIsProcessTrusted()` / `AXIsProcessTrustedWithOptions` (`Core/UI/Permission/AccessibilityPermissionProvider.swift:8-33`) | Capture Area/Quick Annotate/Scrolling/Subject overlays (`OverlayInputEventTap`), OCR, Color Picker, Quick Ring double-`⌘`, Clean Keyboard |
| Screen Recording | `CGPreflightScreenCaptureAccess()` / `CGRequestScreenCaptureAccess()` (`Core/ScreenCapture/ScreenCaptureService.swift:11-20`) | Screenshot, Scrolling, Inline Annotate, OCR, Color Picker |
| Post Event (under Accessibility) | `CGPreflightPostEventAccess()` / `CGRequestPostEventAccess()` (`Modules/Clipboard/Services/Paste/ClipboardDirectPasteService.swift:24-46`) | Clipboard direct paste |

Operational notes:

- Grants are made to the built app's code identity/path. Keep the app at the
  **same path** and **signed** between shots; changing either can invalidate the
  grant (risk E).
- Screen Recording sometimes needs an app relaunch after granting.
- OCR recognition uses Apple Vision and runs locally; Screen Recording is still
  required to capture the selected region. No network is needed for OCR itself.
- These prompts cannot be granted headlessly; a human must approve once per
  capture machine. The Permissions page is
  `Settings/PermissionsSettingsView.swift`; it auto-refreshes when DeskUtils
  becomes active.
- Reset if needed during rehearsal:
  `tccutil reset ScreenCapture com.kienvt.DeskUtils` and
  `tccutil reset Accessibility com.kienvt.DeskUtils` (then re-grant).

---

## 7. Smallest reliable approach to capture native footage

**One machine, one build, preseeded fixtures, per-shot automated driving,
whole-display recording with the built-in `screencapture` tool.**

### 7.1 Environment preparation (once)

1. Dedicated capture user account or clean machine; single display at a fixed
   resolution (e.g. 2560×1440 or 1920×1080), scaling off.
2. Set a neutral desktop wallpaper, hide personal files, sign out of chat/mail.
3. Turn on Do Not Disturb; turn off third-party menu bar extras; if possible
   hide the system clock (Screen Recording privacy).
4. System Settings → Accessibility → Display → **Reduce Motion OFF** (animations
   are otherwise shortened, `AGENTS.md:47`). Pick one appearance
   (Light/Dark) and one accent color.
5. Build the Debug app (§1) and grant Accessibility + Screen Recording once
   (§6).
6. Seed fixtures (§5), then launch with `--demo-mode`.

### 7.2 Recording command

`man screencapture` on the host confirms video options: `-v` (video), `-V<sec>`
limit, `-D<display>` display, `-C` cursor, `-k` click highlights, `-x` silent,
`-R<x,y,w,h>` region.

```bash
mkdir -p /tmp/deskutils-capture
screencapture -v -x -C -k -D1 -V 12 /tmp/deskutils-capture/shot-1-menubar.mov
```

- Capture **one clip per shot** for tight timing. Record 1–2 s of handles on
  both ends.
- `-k` renders clicks (good for the hero); omit it where the pointer would
  distract.
- Region mode (`-R`) is available for tight crops but whole-display + Remotion
  framing is more reliable.
- Only DeskUtils **overlay** windows need `--demo-mode`; the clipboard panel,
  Quick Ring panel, color panel and toasts are ordinary windows and capture
  normally. Run with `--demo-mode` regardless so the selection overlays are
  included.

### 7.3 Driver sketch (outside DeskUtils)

```bash
APP="/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/MacOS/DeskUtils"
"$APP" --demo-mode & sleep 3

# Shot 2: Clipboard
osascript -e 'tell application "System Events" to keystroke "v" using {command down, shift down}'
# ... record clip, then Escape

# Shot 3: Capture Area + OCR
open "deskutils://capture/area"
# drag region with cliclick, then:
open "deskutils://capture/text"

# Shot 5b: Prevent Sleep
osascript -e 'tell application "System Events" to keystroke "p" using {command down, shift down}'
```

### 7.4 Determinism checklist

- [ ] `--demo-mode` active (Debug/Beta binary only).
- [ ] Onboarding preseeded (`completedVersion = 1`); onboarding window absent.
- [ ] Analytics disabled; Sparkle auto-checks off (no update dialog); network on
      only for the one-time Pro activation, then off for recording.
- [ ] Clipboard seeded; nothing real copied during the session.
- [ ] Sandbox/test Pro license activated once for OCR (risk A); no native CTA
      beat, so no non-Pro pass is required.
- [ ] Prevent Sleep reset to off between takes.
- [ ] Same appearance/accent/Reduce Motion/wallpaper for every clip.
- [ ] Cursor position reset between clips; no stray windows.
- [ ] TCC grants still present after the previous clip.

### 7.5 Handoff to Remotion

Place clips in the Remotion project as static assets, e.g.
`public/footage/deskutils-*.mov` (or transcode to H.264 MP4 for size), and
reference them with `staticFile()`. Trim/zoom in Remotion only — do not rebuild
the UI. Author the privacy message card and end card in Remotion with the exact
approved strings (locked decisions 2 and 5). Poster frames can be exported per
clip for low-power/fallback use.

---

## 8. Product gaps and risks that could prevent an accurate capture

Ordered by impact.

**A. OCR requires a Pro license (medium–high).** Capture Text is
`ProFeature.captureText`; without Pro it routes to the upgrade panel instead of
capturing text. A sandbox/test Pro license must be activated once
(`LICENSE_ENVIRONMENT = test`), which needs network + test credentials.
**Mitigation:** activate once, then turn network off; the OCR capture itself runs
locally with Apple Vision and needs no network.

**B. Pro state removes the menu bar CTA capsule (low).** With Pro active, the
`Get DeskUtils Pro` capsule is hidden (`MenuBarView.swift:172`). The film uses a
Remotion end card instead, so this is expected; confirm the Shot 1 hero still
reads well without the capsule.

**C. System Monitoring metrics are real and cannot be seeded (medium).** No
fixture hook exists; values may be low or jittery. **Mitigation:** accept real
values, run a light load to make them plausible, or mask in post. Do not claim
fabricated numbers.

**D. Brittle UI automation (medium).** No XCUITest and no accessibility
identifiers; driving relies on labels, shortcuts and coordinates, which can
break with layout, menu ordering, or menu bar clutter. **Mitigation:** prefer
deep links for captures, take multiple drives per clip, and add AX label checks.

**E. TCC tied to code identity/path (medium).** Re-signing, moving or rebuilding
the app can silently reset Accessibility/Screen Recording, producing empty or
wrong overlay captures. **Mitigation:** keep a signed build at a fixed path and
verify grants before each shot (`tccutil` only when rehearsing).

**F. Onboarding window can cover the launch beat (medium).** If
`com.deskutils.onboarding.completedVersion < 1`, the “DeskUtils Setup” window
appears ~0.3 s after launch (`AppCoordinator.swift:211-230`). Preseed it.

**G. Clipboard monitor pollution (medium).** Anything copied during the session
(OCR results, driver keystrokes) is appended to history and can reorder the demo
list. **Mitigation:** pre-pin the intended items and avoid copying real content;
consider a clean user profile.

**H. Transient toasts (medium).** The OCR result toast and the Prevent Sleep
state toast live only a few seconds (`OCRCaptureServices.swift:26-54`;
`AppCoordinator.swift:128-148`). **Mitigation:** record long with handles and
trim; re-drive if missed.

**I. Quick Ring trigger (medium).** The double-`⌘` gesture needs the
Accessibility event tap; synthetic key events may not reliably register as two
Command taps. The module is menu-hidden, so there is no menu row to click.
**Mitigation:** preseed/assign the alternate global shortcut and send that, or
rehearse synthetic double-`⌘` until reliable.

**J. Privacy message card is not native (low; resolved).** The app has no native
privacy screen; locked decision 5 allows a Remotion card using only the approved
shipped copy. It is not a recreation of DeskUtils UI.

**K. Menu bar / desktop privacy and clutter (low–medium).** The system clock,
user name, third-party menu bar icons and desktop files can leak into footage.
Use a clean account/desktop and mask in post.

**L. Network/telemetry side effects (low–medium).** TelemetryDeck analytics and
Sparkle update checks can fire during capture. Disable analytics; keep network
off except the one-time Pro activation.

**M. OS/appearance mismatch (low).** Liquid Glass renders on macOS 26; the
fallback material renders earlier. Capture on the OS the UI was designed for and
keep appearance stable across clips.

**N. Retina/large files and color profiles (low).** Whole-display ProRes/HEVC
video is large; transcode to H.264 and keep one color profile for the edit.

**O. Screenshot history/store writes real files (low).** Prefer letting the app
capture into `Application Support/DeskUtils/Captures` rather than
`~/Desktop/DeskUtils`, and clean up between rehearsals.

**P. End card/typography consistency (low).** The privacy and end cards are
authored in Remotion; keep one type system, one background treatment and the
exact approved strings so the cards match the native footage.

---

## Appendix A — Verified command summary

```bash
# Build (from /Users/vukien/workspace/DeskUtils; writes only to /tmp)
xcodebuild -resolvePackageDependencies -project DeskUtils.xcodeproj -scheme DeskUtilsDev
xcodebuild -project DeskUtils.xcodeproj -scheme DeskUtilsDev -configuration Debug \
  -destination 'platform=macOS' -derivedDataPath /tmp/DeskUtilsCapture build

# Launch
"/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/MacOS/DeskUtils" --demo-mode &

# Record
screencapture -v -x -C -k -D1 -V 12 /tmp/deskutils-capture/shot-1-menubar.mov
```

## Appendix B — Source references

- `AGENTS.md:23-91` (configs, schemes, build commands, permissions).
- `DeskUtils.xcodeproj/project.pbxproj` (targets, bundle ids, settings).
- `DeskUtils/Core/UI/OverlayCaptureSharing.swift` (`--demo-mode`).
- `DeskUtils/App/DeskUtilsDeepLinkHandler.swift` (deep links).
- `DeskUtils/Core/ModuleManager.swift:381-515` (menu sections).
- `DeskUtils/Modules/QuickRing/Domain/QuickRingActionCatalog.swift:61-75` (slots).
- `DeskUtils/Modules/SystemMonitoring/Menu/SystemMonitoringHeaderView.swift`.
- `DeskUtils/Modules/PreventSleep/PreventSleepModule.swift`.
- `DeskUtils/Modules/OCR/OCRCaptureCoordinator.swift` (Apple Vision, local).
- `Docs/ONBOARDING.md`, `Docs/QUICK_ACCESS.md`, `Modules/*/README.md`.
