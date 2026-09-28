# Capture Preflight

Read-only readiness check for the approved native DeskUtils capture plan
([`native-capture-plan.md`](./native-capture-plan.md)). It verifies the host,
toolchain, DeskUtils source, the future Debug app path, built-in capture tools
and the source working-tree state **before** any build or recording session.

The preflight is strictly diagnostic. It does **not** build, sign, launch,
seed, record, render, install packages, request macOS permissions, or modify the
DeskUtils repository. It creates no directories and never prints secrets,
license keys, clipboard contents or `UserDefaults` values.

## How to run

From the Remotion project root:

```bash
bash capture/preflight.sh
```

Optional flags (all equivalent to the matching environment variable):

```bash
bash capture/preflight.sh --source /Users/vukien/workspace/DeskUtils
bash capture/preflight.sh --derived-data /tmp/DeskUtilsCapture
bash capture/preflight.sh --app /tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app
bash capture/preflight.sh --help
```

Environment variables:

| Variable | Default | Purpose |
|---|---|---|
| `DESKUTILS_SOURCE` | `/Users/vukien/workspace/DeskUtils` | DeskUtils source repository |
| `DESKUTILS_DERIVED_DATA` | `/tmp/DeskUtilsCapture` | DerivedData for the future Debug build |
| `DESKUTILS_APP` | `<derived-data>/Build/Products/Debug/DeskUtils.app` | Explicit app bundle to inspect |
| `CAPTURE_WORK_DIR` | `/tmp/deskutils-capture` | Future recording work directory |
| `CAPTURE_FOOTAGE_DIR` | `<project>/public/footage` | Future footage destination |
| `NO_COLOR` | unset | Disable colored output |

Precedence: command-line flags > environment variables > `capture/config.sh` >
built-in defaults.

To keep local settings, copy the example and edit it:

```bash
cp capture/config.example.sh capture/config.sh
```

`capture/config.sh` is sourced automatically when present. Both it and the
example are configuration only and never run commands.

## What it checks

1. **Host & toolchain** — macOS, Xcode (`xcodebuild` / `xcode-select`), Node and
   npm availability and versions.
2. **Remotion project** — `package.json` with a `remotion` dependency,
   `remotion.config.ts`, `src/`, and installed `node_modules`.
3. **DeskUtils source** — `DeskUtils.xcodeproj`, the shared `DeskUtilsDev`
   scheme, the expected bundle identifier (`com.kienvt.DeskUtils`) and
   `--demo-mode` references in the app source and scheme.
4. **Future Debug app path** — if the app already exists it is inspected (does
   the executable exist? is it signed?); otherwise it reports a clear
   "not built yet" warning with the future build command. It never builds.
5. **Built-in capture tools** — `screencapture`, `osascript`, `open`,
   `defaults`, `tccutil`.
6. **Capture folders** — reports whether the work and footage directories exist
   or could be created later. It inspects parents only and creates nothing.
7. **Git status (warning only)** — reports whether the DeskUtils working tree is
   clean or has changes. It never resets, stashes, commits or otherwise alters
   the repository.

## Output and exit codes

Output uses clearly labelled lines:

- `[PASS]` — check satisfied.
- `[WARN]` — expected/acceptable situation that needs attention later
  (for example: app not built yet, dirty source, permissions not yet granted).
- `[FAIL]` — a genuine missing prerequisite.
- `[INFO]` — neutral context.

Exit codes:

| Code | Meaning |
|---|---|
| `0` | No missing prerequisites. Warnings may still be present. |
| `1` | At least one genuine prerequisite is missing. |
| `2` | Invalid command-line usage (e.g. unknown flag or missing value). |

## Permissions are checked and granted later

The preflight does **not** request or verify macOS Screen Recording or
Accessibility. Those permissions are granted to a specific signed app identity,
so they can only be meaningfully checked after a **fixed-path signed Debug
build** exists:

1. Build the Debug app once at the fixed path
   `/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app` (see
   `native-capture-plan.md` §1).
2. Keep that path and signature stable between shots.
3. Grant **Screen Recording** and **Accessibility** to the built app, then
   confirm each feature works before recording.

The preflight emits this as a deferred `[WARN]` in section 4: before the build it
simply notes the app is not built yet; after the build it reminds you to grant
and verify permissions manually. This keeps the read-only phase free of
permission prompts.

## Notes

- Running `bash capture/preflight.sh` modifies nothing. Re-running it after the
  Debug build is expected and safe.
- If you copy `capture/config.example.sh` to `capture/config.sh`, keep
  `capture/config.sh` out of version control if it contains machine-specific
  paths.
