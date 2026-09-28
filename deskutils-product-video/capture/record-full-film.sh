#!/usr/bin/env bash
#
# DeskUtils full-film native capture orchestrator
# ===============================================
# Captures the six scenes of the 42-second product intro from the already
# running signed Debug DeskUtils app, using only macOS built-ins. It drives the
# app with real keyboard shortcuts and deskutils:// deep links (no screen
# coordinates), records separate silent clips, verifies each output, retries
# unusable scenes up to two times, restores hidden apps, and writes a report.
#
# It never quits apps, never touches DeskUtils source/fixtures/license state,
# and never deletes or overwrites existing MOV files.
#
# Usage:
#   bash capture/record-full-film.sh [--shot <name|all>] [--dry-run]
#
# Scene names: menu, clipboard, capture-ocr, quick-ring, color-picker, utilities

set -euo pipefail

APP_BUNDLE="/tmp/DeskUtilsCapture/Build/Products/Debug/DeskUtils.app"
APP_EXEC="$APP_BUNDLE/Contents/MacOS/DeskUtils"
BASE_OUT="/tmp/deskutils-capture"
STAMP="$(date +%Y%m%d-%H%M%S)"
OUT_DIR="$BASE_OUT/full-film-$STAMP"
REPORT="$OUT_DIR/capture-report.tsv"

PRE_ROLL=2.0
AX_FAIL_TIMEOUT=0

SHOT="all"
DRY_RUN=0
REC_PID=""
TERM_PROCESS=""
TERMINAL_HIDDEN=0
HIDDEN_APPS=""

ALL_SHOTS=(menu clipboard capture-ocr quick-ring color-picker utilities)

usage() {
  cat <<EOF
DeskUtils full-film native capture orchestrator

Usage:
  bash capture/record-full-film.sh [--shot <name|all>] [--dry-run]

Options:
  --shot <name|all>   Capture one scene or all six (default: all).
                      Names: menu, clipboard, capture-ocr, quick-ring,
                             color-picker, utilities
  --dry-run           Print the plan; make no UI or filesystem changes.
  -h, --help          Show this help.

Scenes:
  menu            menu-bar / product presence
  clipboard       Clipboard History (real Cmd-Shift-V)
  capture-ocr     Capture Area + Capture Text deep links
  quick-ring      Quick Ring (double-Command gesture)
  color-picker    Color Picker (real Cmd-Shift-C)
  utilities       Prevent Sleep (Cmd-Shift-P) + System Monitoring menu header

Output: $BASE_OUT/full-film-<timestamp>/
Recording: non-interactive screencapture video, cursor visible, no audio, one
MOV per scene.

Requires the signed Debug app at $APP_BUNDLE to be already running with
--demo-mode.
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
have() { command -v "$1" >/dev/null 2>&1; }

need_value() { [ "$#" -ge 2 ] || die_usage "missing value for option: $1"; }

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --shot) need_value "$@"; SHOT="$2"; shift 2 ;;
      --shot=*) SHOT="${1#*=}"; shift ;;
      --dry-run) DRY_RUN=1; shift ;;
      -h|--help) usage; exit 0 ;;
      *) die_usage "unknown option: $1" ;;
    esac
  done
}

validate_args() {
  if [ "$SHOT" != "all" ]; then
    local ok=0 s
    for s in "${ALL_SHOTS[@]}"; do [ "$s" = "$SHOT" ] && ok=1; done
    [ "$ok" -eq 1 ] || die_usage "--shot must be one of: ${ALL_SHOTS[*]} or all"
  fi
}

require_app_running() {
  [ -d "$APP_BUNDLE" ] || fail "Debug app bundle not found at $APP_BUNDLE. Build it first."
  if ! pgrep -f "$APP_EXEC" >/dev/null 2>&1; then
    fail "DeskUtils is not running from $APP_BUNDLE. Launch it with --demo-mode first."
  fi
  log_pass "DeskUtils is running from the fixed path"
}

check_capabilities() {
  local ax
  ax="$(osascript -e 'tell application "System Events" to get name of first process whose frontmost is true' 2>&1)" || true
  case "$ax" in
    *"-1743"*|*"Not authorized"*|*"assistive"*|*"not allowed"*)
      fail "Blocked: this process cannot control System Events (Apple Events/Accessibility). Grant 'Automation' (System Events) and 'Accessibility' to the app running this script in System Settings > Privacy & Security, then re-run. Detail: $ax"
      ;;
  esac
  local probe="${TMPDIR:-/tmp}/deskutils-scr-probe-$$.png"
  if ! screencapture -x -t png "$probe" >/dev/null 2>&1 || [ ! -s "$probe" ]; then
    rm -f "$probe" 2>/dev/null || true
    fail "Blocked: Screen Recording permission is missing for the app running this script. Grant it in System Settings > Privacy & Security > Screen Recording, then re-run."
  fi
  rm -f "$probe" 2>/dev/null || true
  log_pass "System Events and Screen Recording permissions are available"
}

# --- Clean desktop: hide visible user apps (never quit) --------------------

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
    *"execution error"*) log_warn "Clean-desktop step reported: ${raw}" ;;
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
    [ -n "$list" ] && list="$list, "
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

prepare_clean_desktop() { hide_other_apps; pause 0.5; }

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
  local proc; proc="$(resolve_terminal_process)"
  [ -n "$proc" ] || { log_warn "Could not determine the Terminal process; continuing"; return 0; }
  osascript -e "tell application \"System Events\" to set visible of process \"$proc\" to false" >/dev/null 2>&1 || log_warn "Could not hide '$proc'; continuing"
  TERM_PROCESS="$proc"; TERMINAL_HIDDEN=1
  log_pass "Hid invoking terminal: $proc"
}

restore_terminal() {
  if [ "$TERMINAL_HIDDEN" -eq 1 ] && [ -n "$TERM_PROCESS" ]; then
    osascript -e "tell application \"System Events\" to set visible of process \"$TERM_PROCESS\" to true" >/dev/null 2>&1 || true
    TERMINAL_HIDDEN=0
  fi
}

# --- Input helpers (shortcuts / deep links, no coordinates) ----------------

send_keystroke() {
  local key="$1" mods="$2"
  local script="tell application \"System Events\" to keystroke \"$key\""
  [ -n "$mods" ] && script="$script using {$mods}"
  osascript -e "$script" >/dev/null 2>&1 || log_warn "keystroke '$key' failed"
}

send_key_code() {
  local code="$1"
  osascript -e "tell application \"System Events\" to key code $code" >/dev/null 2>&1 || log_warn "key code $code failed"
}

ax_press_escape() { send_key_code 53; }

open_deskutils_url() {
  local url="$1"
  if open "$url" >/dev/null 2>&1; then
    log_info "Opened $url"
  else
    log_warn "Could not open $url"
  fi
}

ax_double_command() {
  send_key_code 55
  pause 0.1
  send_key_code 55
  log_info "Sent double-Command gesture"
}

# Open the DeskUtils menu-bar item via Accessibility. Non-fatal: returns 1 on
# failure so scenes can continue. Matches any item whose name/description
# contains "DeskUtils" (avoids brittle exact-label failures).
ax_open_menubar() {
  local script raw
  read -r -d '' script <<'APPLESCRIPT' || true
tell application "System Events"
  set procNames to {"DeskUtils", "SystemUIServer", "ControlCenter"}
  repeat with pn in procNames
    set pname to pn as text
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
                if (d contains "DeskUtils") or (n contains "DeskUtils") then
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
    *OK*) log_pass "Opened the DeskUtils menu-bar item"; return 0 ;;
    *) log_warn "Could not open the DeskUtils menu-bar item (${raw:-no result})"; return 1 ;;
  esac
}

# --- Recording -------------------------------------------------------------

start_recording() {
  local out="$1" dur="$2"
  [ -e "$out" ] && fail "Refusing to overwrite existing file: $out"
  screencapture -v -x -C -D 1 -V "$dur" "$out" &
  REC_PID=$!
  log_info "Recording ${dur}s -> ${out##*/} (PID $REC_PID)"
}

mark_rejected() {
  printf 'REJECTED: %s\n' "$2" > "$1.rejected" 2>/dev/null || true
  log_warn "Marked ${1##*/} as rejected: $2"
}

wait_for_recorder() {
  local out="$1" status=0
  wait "$REC_PID" || status=$?
  REC_PID=""
  if [ "$status" -ne 0 ]; then
    mark_rejected "$out" "screencapture exited with status $status"
    return 1
  fi
  if [ ! -s "$out" ]; then
    mark_rejected "$out" "screencapture produced no video"
    return 1
  fi
  return 0
}

# --- Scenes ----------------------------------------------------------------

scene_menu() {
  local out="$1" dur="$2" hold="$3"
  start_recording "$out" "$dur"
  pause "$PRE_ROLL"
  ax_open_menubar || true
  pause "$hold"
  wait_for_recorder "$out" || return 1
  ax_press_escape; pause 0.4
  return 0
}

scene_clipboard() {
  local out="$1" dur="$2" hold="$3"
  start_recording "$out" "$dur"
  pause "$PRE_ROLL"
  ax_press_escape; pause 0.3
  send_keystroke "v" "command down, shift down"
  pause "$hold"
  wait_for_recorder "$out" || return 1
  ax_press_escape; pause 0.4
  return 0
}

scene_capture_ocr() {
  local out="$1" dur="$2" hold="$3"
  start_recording "$out" "$dur"
  pause "$PRE_ROLL"
  open_deskutils_url "deskutils://capture/area"
  pause "$hold"
  ax_press_escape; pause 1.0
  open_deskutils_url "deskutils://capture/text"
  pause "$hold"
  ax_press_escape; pause 0.5
  wait_for_recorder "$out" || return 1
  ax_press_escape; pause 0.4
  return 0
}

scene_quick_ring() {
  local out="$1" dur="$2" hold="$3"
  start_recording "$out" "$dur"
  pause "$PRE_ROLL"
  ax_double_command
  pause "$hold"
  wait_for_recorder "$out" || return 1
  ax_press_escape; pause 0.4
  return 0
}

scene_color_picker() {
  local out="$1" dur="$2" hold="$3"
  start_recording "$out" "$dur"
  pause "$PRE_ROLL"
  send_keystroke "c" "command down, shift down"
  pause "$hold"
  wait_for_recorder "$out" || return 1
  ax_press_escape; pause 0.4
  return 0
}

scene_utilities() {
  local out="$1" dur="$2" hold="$3"
  start_recording "$out" "$dur"
  pause "$PRE_ROLL"
  send_keystroke "p" "command down, shift down"
  pause "$hold"
  ax_press_escape; pause 0.4
  ax_open_menubar || true
  pause 4.0
  wait_for_recorder "$out" || return 1
  ax_press_escape; pause 0.4
  return 0
}

# --- Inspection ------------------------------------------------------------

scene_is_usable() {
  local out="$1"
  [ -s "$out" ] || return 1
  local bytes; bytes="$(wc -c < "$out" | tr -d ' ')"
  [ "$bytes" -ge 20000 ] || return 1
  if have qlmanage; then
    local tdir thumb="" f
    tdir="$(mktemp -d)"
    if qlmanage -t -s 320 -o "$tdir" "$out" >/dev/null 2>&1; then
      for f in "$tdir"/*.png; do
        if [ -e "$f" ] && [ -s "$f" ]; then thumb="$f"; break; fi
      done
    fi
    if [ -n "$thumb" ]; then
      rm -f "$thumb" 2>/dev/null || true
      rmdir "$tdir" 2>/dev/null || true
      return 0
    fi
    rmdir "$tdir" 2>/dev/null || true
    return 1
  fi
  return 0
}

bytes_of() { wc -c < "$1" 2>/dev/null | tr -d ' ' || echo 0; }

# --- Orchestration ---------------------------------------------------------

scene_params() {
  case "$1" in
    menu)          DUR=12; HOLD=5 ;;
    clipboard)     DUR=14; HOLD=7 ;;
    capture-ocr)   DUR=20; HOLD=6 ;;
    quick-ring)    DUR=12; HOLD=6 ;;
    color-picker)  DUR=14; HOLD=6 ;;
    utilities)     DUR=16; HOLD=5 ;;
    *) DUR=12; HOLD=5 ;;
  esac
}

run_scene() {
  local name="$1" attempt="$2"
  scene_params "$name"
  local dur=$(( DUR + attempt * 3 ))
  local hold=$(( HOLD + attempt * 2 ))
  local out="$OUT_DIR/deskutils-$name-$STAMP.mov"
  local fn="scene_$(printf '%s' "$name" | tr '-' '_')"
  log_info "Scene '$name' attempt $((attempt + 1)): duration ${dur}s, hold ${hold}s -> ${out##*/}"
  if "$fn" "$out" "$dur" "$hold"; then
    return 0
  fi
  return 1
}

capture_scene_with_retries() {
  local name="$1" attempt=0
  local out="$OUT_DIR/deskutils-$name-$STAMP.mov"
  while [ "$attempt" -le 2 ]; do
    local ok=0
    run_scene "$name" "$attempt" || ok=1
    if [ "$ok" -eq 0 ] && scene_is_usable "$out"; then
      printf '%s\t%s\t%s\t%s\n' "$name" "${out##*/}" "$(bytes_of "$out")" "ok(retries=$attempt)" >> "$REPORT"
      log_pass "Scene '$name' captured: ${out##*/} ($(bytes_of "$out") bytes)"
      return 0
    fi
    printf '%s\t%s\t%s\t%s\n' "$name" "${out##*/}" "$(bytes_of "$out")" "rejected(attempt=$((attempt + 1)))" >> "$REPORT"
    log_warn "Scene '$name' unusable on attempt $((attempt + 1))"
    attempt=$((attempt + 1))
  done
  log_warn "Scene '$name' remains rejected after retries"
  return 1
}

dry_run() {
  printf '%sDeskUtils full-film capture (dry-run)%s\n' "$C_DIM" "$C_RESET"
  printf 'App bundle : %s\n' "$APP_BUNDLE"
  printf 'Output dir : %s\n' "$OUT_DIR"
  printf 'Shot(s)    : %s\n' "$SHOT"
  local scenes=()
  if [ "$SHOT" = "all" ]; then scenes=("${ALL_SHOTS[@]}"); else scenes=("$SHOT"); fi
  local s
  for s in "${scenes[@]}"; do
    scene_params "$s"
    case "$s" in
      menu)          log_info "[dry-run] menu: pre-roll ${PRE_ROLL}s, AX-open menu bar (contains \"DeskUtils\"), hold ${HOLD}s, ~${DUR}s clip" ;;
      clipboard)     log_info "[dry-run] clipboard: pre-roll ${PRE_ROLL}s, real Cmd-Shift-V, hold ${HOLD}s, ~${DUR}s clip" ;;
      capture-ocr)   log_info "[dry-run] capture-ocr: deskutils://capture/area then deskutils://capture/text, hold ${HOLD}s each, ~${DUR}s clip" ;;
      quick-ring)    log_info "[dry-run] quick-ring: double-Command, hold ${HOLD}s, ~${DUR}s clip" ;;
      color-picker)  log_info "[dry-run] color-picker: real Cmd-Shift-C, hold ${HOLD}s, ~${DUR}s clip" ;;
      utilities)     log_info "[dry-run] utilities: Cmd-Shift-P hold ${HOLD}s, then AX-open menu header (System Monitoring) hold 4s, ~${DUR}s clip" ;;
    esac
  done
  log_info "[dry-run] would write $REPORT, verify non-empty plus qlmanage thumbnail, and retry unusable scenes up to twice."
  log_info "[dry-run] no UI or filesystem changes made."
}

main() {
  parse_args "$@"
  validate_args

  if [ "$DRY_RUN" -eq 1 ]; then
    dry_run
    return 0
  fi

  require_app_running
  check_capabilities

  mkdir -p "$OUT_DIR"
  printf 'scene\tfile\tbytes\tstatus\n' > "$REPORT"
  log_pass "Capture directory ready: $OUT_DIR"

  hide_terminal
  prepare_clean_desktop

  local scenes=() s failures=0
  if [ "$SHOT" = "all" ]; then scenes=("${ALL_SHOTS[@]}"); else scenes=("$SHOT"); fi
  for s in "${scenes[@]}"; do
    if ! capture_scene_with_retries "$s"; then
      failures=$((failures + 1))
    fi
  done

  restore_hidden_apps
  restore_terminal

  log_info "Report: $REPORT"
  if [ "$failures" -gt 0 ]; then
    fail "$failures scene(s) could not be captured; see $REPORT"
  fi
  log_pass "All scenes captured."
}

main "$@"
