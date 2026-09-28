# Capture: Hero + Clipboard Shots

Automated recording for **only the first two approved native DeskUtils shots**:

1. **Menu bar hero**
2. **Clipboard History**

Script: [`../capture/record-hero-clipboard.sh`](../capture/record-hero-clipboard.sh).

It uses only macOS built-ins (`bash`, `osascript`/System Events,
`screencapture`, `pgrep`, `mkdir`, `date`, `sleep`). It does not seed or restore
fixtures, request permissions, build, install anything, or modify the DeskUtils
source repository. It never uses screen coordinates, third-party tools, or UI
recreation.

## Preconditions

1. The signed Debug app exists and is **already running** from the fixed path:
   `/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app`
   Launch it with `--demo-mode` first.
2. Accessibility is granted to the **invoking terminal** (for System Events UI
   scripting) — see permissions below.
3. Screen Recording is granted to the **invoking terminal** (for
   `screencapture`).
4. The DeskUtils menu-bar item is visible and its label is `DeskUtils`.
5. Fixtures are seeded if the Clipboard shot should show demo data
   ([`fixture-workflow.md`](./fixture-workflow.md)); this script never seeds.

## Exact future run command

```bash
# Both shots in one run
bash capture/record-hero-clipboard.sh --output-dir /tmp/deskutils-capture --shot both
```

Other forms:

```bash
# Hero only
bash capture/record-hero-clipboard.sh --output-dir /tmp/deskutils-capture --shot hero

# Clipboard only
bash capture/record-hero-clipboard.sh --output-dir /tmp/deskutils-capture --shot clipboard

# Safe preview: prints commands/actions, makes no UI or filesystem changes
bash capture/record-hero-clipboard.sh --output-dir /tmp/deskutils-capture --dry-run

# Help
bash capture/record-hero-clipboard.sh --help
```

The output directory must be an **absolute path** and must not be inside
`/Users/vukien/workspace/DeskUtils`. The script refuses unsafe directories
(root, home itself, symlinks, non-directories, non-writable paths).

## Clean desktop per shot

Before **every** shot the script uses System Events to hide all visible user
applications **except** `DeskUtils`, `SystemUIServer`, `ControlCenter`, `Dock`,
`loginwindow`, `WindowServer`, `System Events` and `osascript` (plus essential
background-only processes, which are never touched).

- **Finder is hidden as well**, so a Finder window cannot remain visible. The
  wallpaper/Desktop background stays; desktop icons are hidden during capture.
- Visible apps are **hidden, never quit or closed**.
- The invoking Terminal is hidden as well.
- Everything hidden by this run (including Finder) is restored when the run
  finishes, including on failure (exit trap).

## Asynchronous recorder lifecycle

`start_recording` launches `screencapture` in the **background** (`&`), saves
its PID, and logs it. The shot then waits a **1.5 s pre-roll** and confirms the
recorder is still alive **before any DeskUtils interaction**. If the recorder has
already exited, the shot is marked `.rejected` immediately.

The recorder is **waited on to completion before the cleanup Escape**, so the
Escape never races the recording. Success is reported only when the recorder
finished successfully, the MOV is non-empty, and no rejection occurred.

## Timing safety

The fixed recording duration must always exceed:

```
PRE_ROLL (1.5 s) + worst-case verification (4.0 s) + visible hold + END_PADDING (1.5 s)
```

`ax_wait_verify` bounds verification to 4 attempts, so a conservative worst case
is 4.0 s. The holds are never shortened (Hero 4.0 s, Clipboard 6.0 s), and
`validate_timing()` refuses to run if the invariant is violated.

| Shot | Minimum required | Chosen duration |
|---|---|---|
| Hero | 1.5 + 4.0 + 4.0 + 1.5 = 11.0 s | **12 s** |
| Clipboard | 1.5 + 4.0 + 6.0 + 1.5 = 13.0 s | **15 s** |

Both chosen durations exceed the required minimum, leaving end padding after the
hold. The `--dry-run` output prints the chosen duration and the timing
breakdown for each shot.

## Visual preflight and in-recording verification

Before each `screencapture` starts the script runs an Accessibility visual
preflight, and it repeats the same verified interaction while recording. No
screen coordinates are used.

| Shot | Preflight (before recording) | In-recording verification |
|---|---|---|
| Hero | Open the DeskUtils menu-bar item, verify a known item (`Settings` or `Get DeskUtils Pro`) is visible via Accessibility, then Escape. | Re-open the item, verify the same known items, then keep the menu visible **≥ 4 s**, then wait for the recorder, then Escape. |
| Clipboard | Trigger the real `⌘⇧V`, verify the seeded text `DeskUtils demo: order DU-1042 is ready.` is visible via Accessibility, then Escape. | Trigger `⌘⇧V` again, verify the same text, then keep the panel visible **≥ 6 s**, then wait for the recorder, then Escape. |

If a preflight fails, the script aborts **before** starting `screencapture`. If
the in-recording verification fails, it stops the recorder, writes a
`<file>.rejected` marker next to the partial MOV, prints an explicit failure,
and exits non-zero. It never claims success for an unverified shot.

## Expected output files

One MOV per shot, sharing the run timestamp `YYYYmmdd-HHMMSS`:

| Shot | File | Duration | Contents |
|---|---|---|---|
| Menu bar hero | `<output-dir>/deskutils-hero-<timestamp>.mov` | ~12 s | Clean desktop (no Finder/Terminal window); menu-bar item opened via Accessibility; verified menu holds ≥ 4 s; recorder waited to completion. |
| Clipboard History | `<output-dir>/deskutils-clipboard-<timestamp>.mov` | ~15 s | Clean desktop; real `⌘⇧V` opens the panel; verified seeded text holds ≥ 6 s; recorder waited to completion. |

On verification or recorder failure, a sibling marker
`<output-dir>/deskutils-<shot>-<timestamp>.mov.rejected` is written and the run
exits non-zero. **Existing MOV files are never deleted or overwritten.**

Recording characteristics: non-interactive `screencapture` video mode of the
main display (`-D 1`), fixed duration (`-V`), cursor enabled (`-C`), no audio,
no interactive toolbar (`-i`/`-J`/`-U` are not used).

## Exact order of events

### Hero shot

1. Clean desktop: hide all visible user apps (including Finder) except the
   allow list; hide the invoking Terminal. No recording yet.
2. Preflight: open the DeskUtils menu-bar item, verify `Settings` /
   `Get DeskUtils Pro`, press Escape. Abort here if it fails.
3. Start `screencapture` in the background; save the PID.
4. Wait 1.5 s; confirm the recorder PID is alive (else mark `.rejected`).
5. Open the menu-bar item and verify the known items via Accessibility (else
   mark `.rejected`).
6. Hold the open menu for ≥ 4.0 s.
7. Wait for the recorder PID to finish; validate exit status and non-empty MOV
   (else mark `.rejected`).
8. Cleanup Escape; report success.

### Clipboard shot

1. Clean desktop: hide all visible user apps (including Finder) except the
   allow list; hide the invoking Terminal. No recording yet.
2. Preflight: Escape, real `⌘⇧V`, verify the seeded text, Escape. Abort here if
   it fails.
3. Start `screencapture` in the background; save the PID.
4. Wait 1.5 s; confirm the recorder PID is alive (else mark `.rejected`).
5. Escape to clean the desktop, send real `⌘⇧V`, verify the seeded text via
   Accessibility (else mark `.rejected`).
6. Hold the panel for ≥ 6.0 s.
7. Wait for the recorder PID to finish; validate exit status and non-empty MOV
   (else mark `.rejected`).
8. Cleanup Escape; report success.

## Required macOS permissions

| Permission | Granted to | Why |
|---|---|---|
| Accessibility | the invoking terminal (Terminal.app, iTerm2, etc.) | System Events must hide/show apps (including Finder), find and press the DeskUtils menu-bar item, verify UI elements, and send Escape / `⌘⇧V`. Without it the script fails with an actionable Accessibility message. |
| Screen Recording | the invoking terminal | `screencapture` records screen video. Without it, recording produces no usable file and the shot is rejected. |
| Accessibility | the DeskUtils app | Its global shortcut / event tap (including `⌘⇧V`) must be trusted. |
| Screen Recording | the DeskUtils app | Needed for DeskUtils' own capture features in later shots; the `--demo-mode` overlays also rely on it. |

Both grants are tied to code identity/path; keep the Debug build at the fixed
path. After granting Screen Recording or Accessibility, quit and reopen the
terminal if macOS asks. This script never requests permissions.

## Troubleshooting

### Menu-bar lookup or menu verification failure

The script reports a specific message and exits non-zero. Check, in order:

1. **Accessibility.** Grant Accessibility to the invoking terminal in System
   Settings → Privacy & Security → Accessibility. Toggle it off/on if it was
   already enabled, then quit and reopen the terminal.
2. **App is running.** Confirm with `pgrep -f
   "/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app/Contents/MacOS/DeskUtils"`.
   The script refuses to record if it is not running.
3. **Status label changed.** If **Prevent Sleep is on**, the item's label becomes
   `DeskUtils — Prevent Sleep is On`, which does not match `DeskUtils`. Turn
   Prevent Sleep off before the hero shot.
4. **Menu item not found.** The hero verification looks for `Settings`,
   `Get DeskUtils Pro` or `Check for Updates`. If the menu opened but none of
   these are exposed, the accessibility tree may be incomplete; inspect with
   Accessibility Inspector and update the target list in the script.
5. **Menu bar is crowded / hidden.** On notched or crowded menu bars the item
   may be hidden behind the notch or by tools like Bartender/Ice. Reduce menu
   bar icons or unhide the item.
6. **Wrong owning process.** The script searches `DeskUtils`, `SystemUIServer`
   and `ControlCenter`. If your macOS exposes the item elsewhere, inspect it in
   Accessibility Inspector and update the candidate process list.
7. **Still failing.** Do not fall back to screen coordinates. Re-run with
   `--dry-run` to confirm configuration, then capture the item manually and
   report the exact System Events error.

### Clipboard text verification failure

- Seed the fixtures first ([`fixture-workflow.md`](./fixture-workflow.md)); the
  script never seeds.
- The expected text is exactly
  `DeskUtils demo: order DU-1042 is ready.` If the card truncates it, the
  verification fails; check the clipboard panel rendering.
- Ensure the DeskUtils app has Accessibility so the global `⌘⇧V` event tap fires.

### Recorder startup failure

If the recorder exits before any interaction, the shot is marked `.rejected`
with `recorder exited before any interaction`. That usually means Screen
Recording permission is missing for the invoking terminal, or the display is
unavailable.

### Other failures

- **"DeskUtils is not running from ..."** — launch the fixed-path Debug app with
  `--demo-mode` first.
- **"screencapture produced no video"** — grant Screen Recording to the invoking
  terminal and retry.
- **"Could not hide the Terminal window"** — grant Accessibility to the terminal.
- **"Refusing to overwrite an existing file"** — the run timestamp collided;
  wait a second and re-run.
- **`.rejected` marker present** — the shot failed verification or the recorder
  failed; the marker contains the reason.

## Scope and safety

- Hides visible user apps (including Finder) before each shot; never quits or
  closes an app; restores everything hidden at the end.
- Starts the recorder asynchronously, confirms it is alive, and sends no UI
  action until 1.5 s after it starts.
- Duration is length-checked to exceed pre-roll (1.5 s) + worst-case
  verification (4.0 s) + hold + end padding (1.5 s): Hero 12 s, Clipboard 15 s.
- Waits for the recorder to finish before the cleanup Escape.
- Success is reported only after the recorder finished, the MOV is non-empty,
  and no rejection occurred.
- Records only the main display for a fixed duration; one MOV per shot.
- Never seeds, restores, or touches fixture files.
- Never uses `rm -rf`; never deletes or overwrites existing MOV files.
- Never hard-codes screen coordinates.
- `--dry-run` prints the plan and makes no UI or filesystem changes.
- Aborts with an actionable message on missing permissions, a missing UI
  element, an unsafe output path, or a recorder failure.

## Validation performed

The script was validated with `bash -n` only. No recording was executed while
creating or patching this tooling; run `--dry-run` first.
