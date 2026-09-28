# Fixture Workflow

Reversible fixture tooling for the native DeskUtils capture session. It seeds
deterministic, fictional demo data into **the current macOS user's** DeskUtils
state, then restores that user's exact pre-capture state afterwards.

- [`../capture/seed-fixtures.sh`](../capture/seed-fixtures.sh) — backs up state,
  then writes fixtures.
- [`../capture/restore-state.sh`](../capture/restore-state.sh) — restores only
  what the seed script backed up.

This workflow does not modify the DeskUtils source repository, does not build
the app, and does not install dependencies.

## Safety guarantees

- **Explicit backup only.** Both scripts require `--backup-dir <absolute-path>`;
  a backup path is never chosen automatically.
- **No DeskUtils process.** Both scripts refuse to change state while any
  `DeskUtils` / `DeskUtilsDisplayRecovery` process is running (dry-runs warn
  instead and change nothing).
- **Reversible.** The seed script writes a `manifest.tsv` recording exactly what
  existed (`present`) and what did not (`absent`). Restore replays that manifest
  and touches nothing else.
- **Scoped state.** Only the DeskUtils state the capture workflow may change is
  touched:
  - the `com.kienvt.DeskUtils` UserDefaults domain (opaque snapshot),
  - Clipboard History (`clipboard_history.json`, `ClipboardImages/`),
  - screenshot history and capture output (`History/`, `Thumbnails/`,
    `Captures/`).
- **Fictional data only.** Clipboard text, link and a locally generated poster;
  one intentionally pinned item; color recents; enabled modules; onboarding
  dismissed; analytics disabled.
- **License state preserved.** The scripts never activate, deactivate, remove,
  read or print license data.
- **No value leakage.** The scripts never print clipboard contents, license
  keys, analytics identifiers or preference values.
- **No destructive primitives.** `rm -rf` is not used. Path removal is guarded to
  the current user's `~/Library/Application Support/DeskUtils` and refuses
  symlinks and empty paths.
- **No unrelated files.** Other Application Support directories, the Desktop and
  the source repository are untouched.

## Preconditions

1. The signed Debug app exists at
   `/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app` (built earlier).
2. DeskUtils is fully quit (menu bar → Quit DeskUtils).
3. You chose a **new, unique, absolute** backup directory for this session.
4. The backup directory does not already contain a `manifest.tsv` (the seed
   script refuses to overwrite one).

## Future command sequence

Run from the Remotion project root. Replace `SESSION` with a unique value (for
example a timestamp) so each session has its own backup.

### 1. Back up and seed

```bash
# Preview first (changes nothing)
bash capture/seed-fixtures.sh \
  --backup-dir "/tmp/deskutils-fixture-$SESSION" --dry-run

# Back up current state, then write fixtures
bash capture/seed-fixtures.sh \
  --backup-dir "/tmp/deskutils-fixture-$SESSION"
```

The seed script backs up first and writes the manifest, so the backup already
exists before any fixture is applied.

### 2. Launch the Debug app (demo mode)

```bash
"/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/MacOS/DeskUtils" \
  --demo-mode &
```

Screen Recording and Accessibility are granted to this fixed-path signed build
in a later step (see [`capture-preflight.md`](./capture-preflight.md)). Do not
launch with `--demo-mode` omitted: the capture overlays must be recordable.

### 3. Capture

Follow the shot list in
[`native-capture-plan.md`](./native-capture-plan.md). Record clips with the
built-in `screencapture` tool; do not modify the app or seed anything else
mid-session.

### 4. Quit the app

```bash
# LSUIElement app: quit it completely before restoring
osascript -e 'tell application "System Events" to tell process "DeskUtils" to click menu bar item 1 of menu bar 1' 2>/dev/null || true
pkill -x DeskUtils 2>/dev/null || true
pkill -x DeskUtilsDisplayRecovery 2>/dev/null || true

# Confirm it is gone (should print nothing)
pgrep -x DeskUtils || true
pgrep -x DeskUtilsDisplayRecovery || true
```

### 5. Restore

```bash
# Preview first (changes nothing)
bash capture/restore-state.sh \
  --backup-dir "/tmp/deskutils-fixture-$SESSION" --dry-run

# Restore the pre-seed state
bash capture/restore-state.sh \
  --backup-dir "/tmp/deskutils-fixture-$SESSION"
```

### 6. Verify

- Confirm DeskUtils is not running before/after either script.
- Relaunch is not required to restore; the scripts write state directly.
- Keep the backup directory until you have confirmed the restored app looks
  correct. Once confirmed, the backup can be discarded by you.

## Copy-paste sequence

```bash
SESSION="$(date +%Y%m%d-%H%M%S)"
BACKUP="/tmp/deskutils-fixture-$SESSION"

bash capture/seed-fixtures.sh   --backup-dir "$BACKUP" --dry-run
bash capture/seed-fixtures.sh   --backup-dir "$BACKUP"

"/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/MacOS/DeskUtils" --demo-mode &

# ... capture clips ...

pkill -x DeskUtils 2>/dev/null || true
pkill -x DeskUtilsDisplayRecovery 2>/dev/null || true

bash capture/restore-state.sh   --backup-dir "$BACKUP" --dry-run
bash capture/restore-state.sh   --backup-dir "$BACKUP"
```

## What is seeded

| Area | Fixture |
|---|---|
| Clipboard text | `DeskUtils demo: order DU-1042 is ready.` |
| Clipboard link | `https://example.com/deskutils-demo` |
| Clipboard image | locally generated gradient poster (`11111111-1111-1111-1111-111111111111.png`, 1200×800) |
| Pinned item | the link item is pinned |
| Color recents | four brand hex values (`#0A84FF`, `#FF9F0A`, `#BF5AF2`, `#30D158`) |
| Enabled modules | clipboard, color picker, OCR, screenshot, system monitoring, prevent sleep, quick ring |
| Onboarding | dismissed |
| Analytics | disabled |

Clipboard history is written as JSON with the image's real byte count and
SHA-256 so the app loads it cleanly.

## Notes and limits

- The scripts operate on the current user's `~/Library` only; they refuse to run
  as root.
- Only the app's own UserDefaults domain is snapshotted (opaque); unrelated
  domains are never touched.
- Screenshot **export** locations outside Application Support (for example a
  custom folder or `~/Desktop/DeskUtils`) are out of scope. Disable automatic
  Save or point export at a scratch folder before capturing.
- If a seed run is interrupted, do not re-run into the same `--backup-dir`
  (the manifest already exists). Use a fresh session directory, or restore from
  the existing backup first.
- Both scripts support `--help`.

## Validation performed

The scripts are shell-syntax-checked only (`bash -n`). Their state-changing
paths were not executed while creating this tooling; run the dry-runs above
before the first real session.
