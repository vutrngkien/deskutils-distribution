#!/usr/bin/env bash
#
# DeskUtils hero + Clipboard capture automation
# =============================================
# Records the first two approved native DeskUtils shots using only macOS
# built-ins:
#   1. Menu bar hero
#   2. Clipboard History
#
# For every shot it first hides all visible user applications except DeskUtils,
# SystemUIServer, ControlCenter and essential macOS background processes (never
# quitting or closing anything). Finder is hidden as well so no Finder window
# can appear; the wallpaper/Desktop background remains. It then runs an
# Accessibility visual preflight and only starts screencapture if the expected
# UI is actually visible. The same interaction is verified again during the
# recording; if it fails, the shot is marked rejected.
#
# The recorder runs asynchronously (`screencapture ... &`), its PID is saved and
# confirmed alive, and no UI action is sent until 1.5 s after it starts. The
# recorder is waited on to completion before the cleanup Escape, and success is
# reported only after the recorder finished, the MOV is non-empty, and no
# rejection occurred.
#
# It does NOT seed or restore fixtures, request permissions, build, install
# anything, or modify the DeskUtils source repository. It never uses screen
# coordinates or third-party tools.
#
# Usage:
#   bash capture/record-hero-clipboard.sh --output-dir /abs/path [--shot both]
#
# See docs/capture-hero-clipboard.md.

set -euo pipefail

APP_BUNDLE="/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app"
APP_EXEC="$APP_BUNDLE/Contents/MacOS/DeskUtils"
SOURCE_REPO="/Users/vukien/workspace/DeskUtils"

# Timing safety. The recording duration must always exceed:
#   PRE_ROLL + worst-case Accessibility verification + visible hold + END_PADDING
# The tenths-of-a-second constants drive the pauses and enforce the invariant in
# validate_timing().
PRE_ROLL_TENTHS=15          # 1.5 s
END_PADDING_TENTHS=15       # 1.5 s
AX_VERIFY_TENTHS=40         # 4.0 s worst case (bounded by ax_wait_verify)
HERO_HOLD_TENTHS=40         # 4.0 s (never shortened)
CLIPBOARD_HOLD_TENTHS=60    # 6.0 s (never shortened)
HERO_DURATION=12            # 12.0 > 1.5 + 4.0 + 4.0 + 1.5 = 11.0
CLIPBOARD_DURATION=15       # 15.0 > 1.5 + 4.0 + 6.0 + 1.5 = 13.0
PRE_ROLL=1.5
HERO_HOLD=4.0
CLIPBOARD_HOLD=6.0
CLIPBOARD_EXPECTED_TEXT="DeskUtils demo: order DU-1042 is ready."

OUTPUT_DIR=""
SHOT="both"
DRY_RUN=0
STAMP="$(date +%Y%m%d-%H%M%S)"
REC_PID=""
TERM_PROCESS=""
TERMINAL_HIDDEN=0
HIDDEN_APPS=""

usage() {
  cat <<EOF
DeskUtils hero + Clipboard capture automation

Usage:
  bash capture/record-hero-clipboard.sh --output-dir <absolute-path> [options]

Required:
  --output-dir <path>   Absolute directory for the recorded MOV files.
                        Must not be inside the DeskUtils source repository.

Options:
  --shot <value>        hero | clipboard | both   (default: both)
  --dry-run             Print the planned actions and commands; make no UI or
                        filesystem changes.
  -h, --help            Show this help and exit.

Per shot:
  * hide every visible user app except DeskUtils, SystemUIServer,
    ControlCenter and essential background processes; Finder is hidden too so
    no Finder window can appear (apps are never quit)
  * Accessibility visual preflight; abort before recording if it fails
  * start screencapture in the background, save its PID, confirm it is alive,
    and do not send UI actions until ${PRE_ROLL}s after it starts
  * verified interaction repeated while recording
  * Hero keeps the open menu visible >= ${HERO_HOLD}s (clip ~${HERO_DURATION}s)
  * Clipboard keeps the panel visible >= ${CLIPBOARD_HOLD}s (clip ~${CLIPBOARD_DURATION}s)
  * durations are length-checked: duration > pre-roll (1.5s) + verification
    (worst case 4.0s) + hold + end padding (1.5s)
  * wait for the recorder to finish before the cleanup Escape
  * success is reported only after the recorder finished, the MOV is non-empty,
    and no rejection occurred; otherwise a .rejected marker is written

Recording: non-interactive screencapture video, cursor visible, no audio, no
interactive toolbar, one MOV per shot.

A real recording is refused unless the signed Debug app is already running from
$APP_BUNDLE

macOS built-ins only (no third-party tools): bash, osascript/System Events,
screencapture, pgrep, mkdir, date, sleep.
EOF
}

if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_PASS=$'\033[32m'; C_WARN=$'\033[33m'; C_FAIL=$'\033[31m'
  C_DIM=$'\033[2m'; C_RESET=$'\033[0m'
else
  C_PASS=''; C_WARN=''; C_FAIL=''; C_DIM=''; C_RESET=''
fi

log_pass() { printf '%s[PASS]%s %s\n' "$C_PASS" "$C_RESET" "$*"; }
log_warn() { printf '%s[WARN]%s %s\n' "$C_WARN" "$C_RESET" "$*"; }
log_info() { printf '%s[INFO]%s %s\n' "$C_DIM" "$C_RESET" "$*"; }
fail() { printf '%s[FAIL]%s %s\n' "$C_FAIL" "$C_RESET" "$*" >&2; exit 1; }
die_usage() { printf 'Error: %s\n\n' "$*" >&2; usage >&2; exit 2; }

on_exit() {
  if [ -n "${REC_PID:-}" ] && kill -0 "$REC_PID" 2>/dev/null; then
    kill "$REC_PID" 2>/dev/null || true
  fi
  restore_hidden_apps
  restore_terminal
}
trap on_exit EXIT

pause() { sleep "$1"; }

need_value() {
  [ "$#" -ge 2 ] || die_usage "missing value for option: $1"
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --output-dir)
        need_value "$@"
        OUTPUT_DIR="$2"
        shift 2
        ;;
      --output-dir=*)
        OUTPUT_DIR="${1#*=}"
        shift
        ;;
      --shot)
        need_value "$@"
        SHOT="$2"
        shift 2
        ;;
      --shot=*)
        SHOT="${1#*=}"
        shift
        ;;
      --dry-run)
        DRY_RUN=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die_usage "unknown option: $1"
        ;;
    esac
  done
}

validate_args() {
  [ -n "$OUTPUT_DIR" ] || die_usage "--output-dir is required"
  case "$OUTPUT_DIR" in
    /*) ;;
    *) fail "--output-dir must be an absolute path: $OUTPUT_DIR" ;;
  esac
  case "$OUTPUT_DIR" in
    "/") fail "--output-dir must not be the filesystem root" ;;
    "$HOME") fail "--output-dir must not be the home directory itself" ;;
    "$SOURCE_REPO"|"$SOURCE_REPO"/*)
      fail "--output-dir must not be inside the DeskUtils source repository ($SOURCE_REPO)"
      ;;
  esac
  if [ -L "$OUTPUT_DIR" ]; then
    fail "--output-dir must not be a symlink: $OUTPUT_DIR"
  fi
  if [ -e "$OUTPUT_DIR" ] && [ ! -d "$OUTPUT_DIR" ]; then
    fail "--output-dir exists but is not a directory: $OUTPUT_DIR"
  fi
  if [ -d "$OUTPUT_DIR" ] && [ ! -w "$OUTPUT_DIR" ]; then
    fail "--output-dir is not writable: $OUTPUT_DIR"
  fi
  case "$SHOT" in
    hero|clipboard|both) ;;
    *) die_usage "--shot must be hero, clipboard, or both (got: $SHOT)" ;;
  esac
}

# Enforce: duration (tenths) > PRE_ROLL + AX_VERIFY + HOLD + END_PADDING.
validate_timing() {
  local hero_required=$(( PRE_ROLL_TENTHS + AX_VERIFY_TENTHS + HERO_HOLD_TENTHS + END_PADDING_TENTHS ))
  local clipboard_required=$(( PRE_ROLL_TENTHS + AX_VERIFY_TENTHS + CLIPBOARD_HOLD_TENTHS + END_PADDING_TENTHS ))
  if [ $(( HERO_DURATION * 10 )) -le "$hero_required" ]; then
    fail "Timing invariant violated for Hero: ${HERO_DURATION}s must exceed pre-roll 1.5s + verify 4.0s + hold ${HERO_HOLD}s + padding 1.5s."
  fi
  if [ $(( CLIPBOARD_DURATION * 10 )) -le "$clipboard_required" ]; then
    fail "Timing invariant violated for Clipboard: ${CLIPBOARD_DURATION}s must exceed pre-roll 1.5s + verify 4.0s + hold ${CLIPBOARD_HOLD}s + padding 1.5s."
  fi
  log_pass "Timing budget OK (Hero ${HERO_DURATION}s, Clipboard ${CLIPBOARD_DURATION}s)"
}

require_app_running() {
  [ -d "$APP_BUNDLE" ] || fail "Debug app bundle not found at $APP_BUNDLE. Build it first (see docs/capture-preflight.md)."
  if ! pgrep -f "$APP_EXEC" >/dev/null 2>&1; then
    fail "DeskUtils is not running from $APP_BUNDLE. Launch the signed Debug app with --demo-mode first; refusing to record."
  fi
  log_pass "Debug app is running from the fixed path: $APP_BUNDLE"
}

app_is_running() {
  [ -d "$APP_BUNDLE" ] && pgrep -f "$APP_EXEC" >/dev/null 2>&1
}

# --- Clean desktop: hide visible user apps (never quit) --------------------
# Finder is intentionally NOT in the allow list, so Finder windows and desktop
# icons cannot appear in the recording. Only the wallpaper/Desktop background
# remains. Everything hidden is restored after the run.

hide_other_apps() {
  local script raw name
  read -r -d '' script <<'APPLESCRIPT' || true
tell application "System Events"
  set allowList to {"DeskUtils", "SystemUIServer", "ControlCenter", "Dock", "loginwindow", "WindowServer", "System Events", "osascript"}
  set hiddenNames to {}
  repeat with p in (every process whose background only is false)
    try
      set pname to name of p
      if (visible of p is true) and (allowList does not contain pname) then
        set visible of p to false
        set end of hiddenNames to pname
      end if
    end try
  end repeat
  set outText to ""
  repeat with hn in hiddenNames
    set outText to outText & (hn as text) & linefeed
  end repeat
  return outText
end tell
APPLESCRIPT

  raw="$(osascript - 2>&1 <<< "$script")" || true

  case "$raw" in
    *"assistive"*|*"-1743"*|*"not allowed"*|*"Not authorized"*)
      fail "Clean-desktop step failed: Accessibility permission is missing for your terminal. Grant it in System Settings > Privacy & Security > Accessibility, then retry."
      ;;
    *"execution error"*|*"-1728"*)
      fail "Clean-desktop step failed (System Events error): ${raw}"
      ;;
  esac

  while IFS= read -r name; do
    [ -n "$name" ] || continue
    HIDDEN_APPS="${HIDDEN_APPS}${name}"$'\n'
    log_info "Hid application: $name"
  done <<< "$raw"
}

restore_hidden_apps() {
  [ -n "$HIDDEN_APPS" ] || return 0
  local list="" name esc
  while IFS= read -r name; do
    [ -n "$name" ] || continue
    esc="${name//\\/\\\\}"
    esc="${esc//\"/\\\"}"
    if [ -n "$list" ]; then
      list="$list, "
    fi
    list="$list\"$esc\""
  done <<< "$HIDDEN_APPS"
  if [ -n "$list" ]; then
    osascript \
      -e 'tell application "System Events"' \
      -e "set nameList to {$list}" \
      -e 'repeat with pn in nameList' \
      -e 'try' \
      -e 'set visible of process (pn as text) to true' \
      -e 'end try' \
      -e 'end repeat' \
      -e 'end tell' >/dev/null 2>&1 || true
    log_info "Restored previously hidden applications"
  fi
  HIDDEN_APPS=""
}

prepare_clean_desktop() {
  hide_other_apps
  pause 0.4
}

# --- Terminal hiding -------------------------------------------------------

resolve_terminal_process() {
  local proc=""
  case "${TERM_PROGRAM:-}" in
    Apple_Terminal) proc="Terminal" ;;
    iTerm.app) proc="iTerm2" ;;
    WezTerm) proc="WezTerm" ;;
    WarpTerminal) proc="Warp" ;;
    hyper) proc="Hyper" ;;
    vscode) proc="Code" ;;
    kitty) proc="kitty" ;;
    Alacritty) proc="Alacritty" ;;
    *) proc="" ;;
  esac
  if [ -z "$proc" ]; then
    proc="$(osascript -e 'tell application "System Events" to get name of first process whose frontmost is true' 2>/dev/null || true)"
  fi
  printf '%s' "$proc"
}

hide_terminal() {
  local proc
  proc="$(resolve_terminal_process)"
  if [ -z "$proc" ]; then
    fail "Could not determine the invoking Terminal process. Grant Accessibility to Terminal and retry, or run from a supported terminal."
  fi
  if ! osascript -e "tell application \"System Events\" to set visible of process \"$proc\" to false" >/dev/null 2>&1; then
    fail "Could not hide the Terminal window '$proc'. Grant Accessibility (System Settings > Privacy & Security > Accessibility) to your terminal, then retry."
  fi
  TERM_PROCESS="$proc"
  TERMINAL_HIDDEN=1
  log_pass "Hid invoking terminal: $proc"
}

restore_terminal() {
  if [ "$TERMINAL_HIDDEN" -eq 1 ] && [ -n "$TERM_PROCESS" ]; then
    osascript -e "tell application \"System Events\" to set visible of process \"$TERM_PROCESS\" to true" >/dev/null 2>&1 || true
    TERMINAL_HIDDEN=0
  fi
}

# --- Accessibility actions -------------------------------------------------

check_ax_error() {
  local raw="$1" what="$2"
  case "$raw" in
    *"assistive"*|*"-1743"*|*"not allowed"*|*"Not authorized"*)
      fail "$what failed: Accessibility permission is missing. Grant Accessibility to your terminal in System Settings > Privacy & Security > Accessibility, then retry."
      ;;
    *) return 0 ;;
  esac
}

# Find the DeskUtils menu-bar item by its accessibility name/description and
# press it. Never uses screen coordinates. Returns non-zero on failure.
ax_find_and_press_menubar() {
  local script raw
  read -r -d '' script <<'APPLESCRIPT' || true
tell application "System Events"
  set procNames to {"DeskUtils", "SystemUIServer", "ControlCenter"}
  repeat with pn in procNames
    set pname to (pn as text)
    if exists process pname then
      tell process pname
        try
          repeat with mb in menu bars
            try
              repeat with mbi in menu bar items of mb
                set d to ""
                set n to ""
                try
                  set d to (description of mbi) as text
                end try
                try
                  set n to (name of mbi) as text
                end try
                if (d is "DeskUtils") or (n is "DeskUtils") then
                  try
                    perform action "AXPress" of mbi
                  on error
                    click mbi
                  end try
                  return "OK"
                end if
              end repeat
            end try
          end repeat
        end try
      end tell
    end if
  end repeat
  return "NOTFOUND"
end tell
APPLESCRIPT

  raw="$(osascript - 2>&1 <<< "$script")" || true

  case "$raw" in
    *"assistive"*|*"-1743"*|*"not allowed"*|*"Not authorized"*)
      log_warn "Menu-bar lookup: Accessibility permission is missing for the terminal"
      return 1
      ;;
    *OK*)
      log_pass "Opened the DeskUtils menu-bar item via Accessibility"
      return 0
      ;;
    *NOTFOUND*)
      log_warn "Menu-bar lookup: no menu-bar item labeled/described 'DeskUtils'"
      return 1
      ;;
    *)
      log_warn "Menu-bar lookup failed unexpectedly: ${raw:-<empty>}"
      return 1
      ;;
  esac
}

# Verify that a known menu item is present through Accessibility (no
# coordinates). Works for both NSMenu-style and window-style menu bar extras.
ax_verify_menu_items() {
  local script raw
  read -r -d '' script <<'APPLESCRIPT' || true
tell application "System Events"
  set targets to {"Settings", "Get DeskUtils Pro", "Check for Updates"}
  repeat with pn in {"DeskUtils", "SystemUIServer", "ControlCenter"}
    set pname to pn as text
    if exists process pname then
      tell process pname
        try
          repeat with mb in menu bars
            try
              repeat with mbi in menu bar items of mb
                try
                  repeat with mi in menu items of menu 1 of mbi
                    try
                      set nm to (name of mi) as text
                      if nm is in targets then return "FOUND"
                    end try
                  end repeat
                end try
              end repeat
            end try
          end repeat
        end try
        try
          repeat with w in windows
            try
              repeat with el in (entire contents of w)
                try
                  set nm to (name of el) as text
                  if nm is in targets then return "FOUND"
                end try
                try
                  set ds to (description of el) as text
                  if ds is in targets then return "FOUND"
                end try
              end repeat
            end try
          end repeat
        end try
      end tell
    end if
  end repeat
  return "NOTFOUND"
end tell
APPLESCRIPT

  raw="$(osascript - 2>&1 <<< "$script")" || true

  case "$raw" in
    *"assistive"*|*"-1743"*|*"not allowed"*|*"Not authorized"*)
      log_warn "Menu verification: Accessibility permission is missing for the terminal"
      return 1
      ;;
    *NOTFOUND*)
      return 1
      ;;
    *FOUND*)
      return 0
      ;;
    *)
      log_warn "Menu verification failed unexpectedly: ${raw:-<empty>}"
      return 1
      ;;
  esac
}

ax_verify_clipboard_text() {
  local script raw
  read -r -d '' script <<APPLESCRIPT || true
tell application "System Events"
  set targetText to "${CLIPBOARD_EXPECTED_TEXT}"
  if exists process "DeskUtils" then
    tell process "DeskUtils"
      try
        repeat with w in windows
          try
            repeat with el in (entire contents of w)
              try
                if (name of el as text) contains targetText then return "FOUND"
              end try
              try
                if (description of el as text) contains targetText then return "FOUND"
              end try
              try
                if (value of el as text) contains targetText then return "FOUND"
              end try
            end repeat
          end try
        end repeat
      end try
    end tell
  end if
  return "NOTFOUND"
end tell
APPLESCRIPT

  raw="$(osascript - 2>&1 <<< "$script")" || true

  case "$raw" in
    *"assistive"*|*"-1743"*|*"not allowed"*|*"Not authorized"*)
      log_warn "Clipboard verification: Accessibility permission is missing for the terminal"
      return 1
      ;;
    *NOTFOUND*)
      return 1
      ;;
    *FOUND*)
      return 0
      ;;
    *)
      log_warn "Clipboard verification failed unexpectedly: ${raw:-<empty>}"
      return 1
      ;;
  esac
}

# Poll a verification function a few times to absorb UI settle time.
ax_wait_verify() {
  local checker="$1" tries=0
  while [ "$tries" -lt 4 ]; do
    if "$checker"; then
      return 0
    fi
    pause 0.4
    tries=$((tries + 1))
  done
  return 1
}

ax_press_escape() {
  local raw
  raw="$(osascript -e 'tell application "System Events" to key code 53' 2>&1)" || true
  check_ax_error "$raw" "Escape key"
  log_info "Pressed Escape"
}

ax_press_clipboard_shortcut() {
  local raw
  raw="$(osascript -e 'tell application "System Events" to keystroke "v" using {command down, shift down}' 2>&1)" || true
  check_ax_error "$raw" "Clipboard shortcut (Cmd-Shift-V)"
  log_pass "Sent the real Cmd-Shift-V shortcut"
}

# --- Preflight (before screencapture) --------------------------------------

preflight_hero() {
  log_info "Preflight (hero): opening menu-bar item and verifying menu content"
  if ! ax_find_and_press_menubar; then
    fail "Hero preflight failed: the DeskUtils menu-bar item could not be opened. No recording started. See docs/capture-hero-clipboard.md troubleshooting."
  fi
  if ! ax_wait_verify ax_verify_menu_items; then
    ax_press_escape >/dev/null 2>&1 || true
    fail "Hero preflight failed: expected menu items (Settings / Get DeskUtils Pro) were not visible via Accessibility. No recording started."
  fi
  ax_press_escape
  pause 0.4
  log_pass "Hero preflight verified the open menu"
}

preflight_clipboard() {
  log_info "Preflight (clipboard): triggering Cmd-Shift-V and verifying seeded text"
  ax_press_escape
  pause 0.3
  ax_press_clipboard_shortcut
  if ! ax_wait_verify ax_verify_clipboard_text; then
    ax_press_escape >/dev/null 2>&1 || true
    fail "Clipboard preflight failed: the seeded text '${CLIPBOARD_EXPECTED_TEXT}' was not visible via Accessibility. Seed fixtures first and confirm the panel opens. No recording started."
  fi
  ax_press_escape
  pause 0.4
  log_pass "Clipboard preflight verified the seeded text"
}

# --- Recording (asynchronous) ----------------------------------------------

start_recording() {
  local out="$1" dur="$2"
  if [ -e "$out" ]; then
    fail "Refusing to overwrite an existing file: $out"
  fi
  screencapture -v -x -C -D 1 -V "$dur" "$out" &
  REC_PID=$!
  log_info "Started recorder in background (PID $REC_PID), ${dur}s -> ${out##*/}"
}

recorder_alive() {
  [ -n "${REC_PID:-}" ] && kill -0 "$REC_PID" 2>/dev/null
}

# Wait for the recorder to finish, then validate the output. Only returns on
# success; otherwise the shot is marked rejected.
wait_for_recorder() {
  local out="$1"
  local status=0
  wait "$REC_PID" || status=$?
  REC_PID=""
  if [ "$status" -ne 0 ]; then
    reject_recording "$out" "screencapture exited with status $status (Screen Recording permission?)"
  fi
  if [ ! -s "$out" ]; then
    reject_recording "$out" "screencapture produced no video (Screen Recording permission?)"
  fi
}

reject_recording() {
  local out="$1" reason="$2"
  if [ -n "${REC_PID:-}" ] && kill -0 "$REC_PID" 2>/dev/null; then
    kill "$REC_PID" 2>/dev/null || true
    REC_PID=""
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] would mark ${out##*/} as rejected ($reason)"
  else
    printf 'REJECTED: %s\n' "$reason" > "$out.rejected" 2>/dev/null || true
    printf '%s[REJECTED]%s %s\n' "$C_FAIL" "$C_RESET" "Marked ${out##*/} as rejected: $reason" >&2
  fi
  exit 1
}

# --- Shots -----------------------------------------------------------------

# Order of events for the Hero shot (recording):
#   1. clean desktop + hide Terminal (no recording yet)
#   2. preflight: open the menu item, verify known items, Escape (abort if fail)
#   3. start screencapture in background, save PID
#   4. wait PRE_ROLL (1.5 s), then confirm the recorder is still alive
#   5. open the menu-bar item, verify known items via Accessibility
#      (on failure: mark .rejected)
#   6. hold the open menu >= HERO_HOLD (4.0 s)
#   7. wait for the recorder PID to finish and validate the MOV is non-empty
#      (on failure: mark .rejected)
#   8. cleanup Escape, then report success
run_shot_hero() {
  local out="$OUTPUT_DIR/deskutils-hero-$STAMP.mov"
  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] clean desktop: hide all visible user apps including Finder except DeskUtils, SystemUIServer, ControlCenter (never quit)"
    log_info "[dry-run] preflight: open menu-bar item 'DeskUtils', verify Settings/Get DeskUtils Pro, Escape"
    log_info "[dry-run] start: screencapture -v -x -C -D 1 -V $HERO_DURATION \"$out\" &  (save PID)"
    log_info "[dry-run] wait ${PRE_ROLL}s, confirm recorder alive, then open + verify menu, hold >= ${HERO_HOLD}s"
    log_info "[dry-run] timing: ${HERO_DURATION}s duration > ${PRE_ROLL}s pre-roll + 4.0s verify + ${HERO_HOLD}s hold + 1.5s padding"
    log_info "[dry-run] wait for recorder PID to finish, then cleanup Escape, then confirm non-empty MOV"
    return 0
  fi
  prepare_clean_desktop
  preflight_hero
  log_info "Shot 1/2: Menu bar hero"
  start_recording "$out" "$HERO_DURATION"
  pause "$PRE_ROLL"
  if ! recorder_alive; then
    reject_recording "$out" "recorder exited before any interaction"
  fi
  if ! ax_find_and_press_menubar; then
    reject_recording "$out" "menu-bar item could not be opened during recording"
  fi
  if ! ax_wait_verify ax_verify_menu_items; then
    reject_recording "$out" "expected menu items were not visible during recording"
  fi
  log_pass "Hero menu verified visible during recording; holding"
  pause "$HERO_HOLD"
  wait_for_recorder "$out"
  ax_press_escape
  pause 0.3
  log_pass "Saved ${out##*/}"
}

# Order of events for the Clipboard shot (recording):
#   1. clean desktop + hide Terminal (no recording yet)
#   2. preflight: Escape, real Cmd-Shift-V, verify seeded text, Escape
#      (abort if fail)
#   3. start screencapture in background, save PID
#   4. wait PRE_ROLL (1.5 s), then confirm the recorder is still alive
#   5. Escape to clean the desktop, send real Cmd-Shift-V, verify the seeded
#      text via Accessibility (on failure: mark .rejected)
#   6. hold the panel >= CLIPBOARD_HOLD (6.0 s)
#   7. wait for the recorder PID to finish and validate the MOV is non-empty
#      (on failure: mark .rejected)
#   8. cleanup Escape, then report success
run_shot_clipboard() {
  local out="$OUTPUT_DIR/deskutils-clipboard-$STAMP.mov"
  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] clean desktop: hide all visible user apps including Finder except DeskUtils, SystemUIServer, ControlCenter (never quit)"
    log_info "[dry-run] preflight: real Cmd-Shift-V, verify seeded text, Escape"
    log_info "[dry-run] start: screencapture -v -x -C -D 1 -V $CLIPBOARD_DURATION \"$out\" &  (save PID)"
    log_info "[dry-run] wait ${PRE_ROLL}s, confirm recorder alive, then Cmd-Shift-V + verify, hold >= ${CLIPBOARD_HOLD}s"
    log_info "[dry-run] timing: ${CLIPBOARD_DURATION}s duration > ${PRE_ROLL}s pre-roll + 4.0s verify + ${CLIPBOARD_HOLD}s hold + 1.5s padding"
    log_info "[dry-run] wait for recorder PID to finish, then cleanup Escape, then confirm non-empty MOV"
    return 0
  fi
  prepare_clean_desktop
  preflight_clipboard
  log_info "Shot 2/2: Clipboard History"
  start_recording "$out" "$CLIPBOARD_DURATION"
  pause "$PRE_ROLL"
  if ! recorder_alive; then
    reject_recording "$out" "recorder exited before any interaction"
  fi
  ax_press_escape
  pause 0.3
  ax_press_clipboard_shortcut
  if ! ax_wait_verify ax_verify_clipboard_text; then
    reject_recording "$out" "seeded clipboard text was not visible during recording"
  fi
  log_pass "Clipboard panel verified visible during recording; holding"
  pause "$CLIPBOARD_HOLD"
  wait_for_recorder "$out"
  ax_press_escape
  pause 0.3
  log_pass "Saved ${out##*/}"
}

main() {
  parse_args "$@"
  validate_args
  validate_timing

  printf '%sDeskUtils hero + Clipboard capture%s%s\n' "$C_DIM" "$C_RESET" "$([ "$DRY_RUN" -eq 1 ] && echo ' (dry-run)')"
  printf 'Output dir : %s\n' "$OUTPUT_DIR"
  printf 'Shot(s)    : %s\n' "$SHOT"

  if [ "$DRY_RUN" -eq 1 ]; then
    if app_is_running; then
      log_pass "Debug app appears to be running (dry-run; no interaction)"
    else
      log_warn "Debug app is not running from $APP_BUNDLE; a real run would refuse"
    fi
    case "$SHOT" in
      hero) run_shot_hero ;;
      clipboard) run_shot_clipboard ;;
      both) run_shot_hero; run_shot_clipboard ;;
    esac
    log_info "Dry-run complete; no UI or filesystem changes were made."
    return 0
  fi

  require_app_running
  mkdir -p "$OUTPUT_DIR"
  if [ ! -w "$OUTPUT_DIR" ]; then
    fail "Output directory is not writable: $OUTPUT_DIR"
  fi
  log_pass "Output directory ready: $OUTPUT_DIR"
  hide_terminal

  case "$SHOT" in
    hero) run_shot_hero ;;
    clipboard) run_shot_clipboard ;;
    both) run_shot_hero; run_shot_clipboard ;;
  esac

  restore_hidden_apps
  restore_terminal
  log_pass "Capture complete."
}

main "$@"
