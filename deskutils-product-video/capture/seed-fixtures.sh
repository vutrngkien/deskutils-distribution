#!/usr/bin/env bash
#
# DeskUtils capture fixture seeder (reversible)
# ============================================
# Backs up the current user's DeskUtils state, then writes deterministic,
# fictional demo fixtures for the approved capture workflow (clipboard items,
# a generated poster image, color recents, enabled modules, onboarding
# dismissed, analytics disabled).
#
# Pair with capture/restore-state.sh, which restores exactly what this script
# backed up.
#
# Safety:
#   * Requires an explicit --backup-dir (never chosen automatically).
#   * Refuses to run while any DeskUtils process is active.
#   * Preserves license state; never activates, deactivates, removes or prints
#     license data.
#   * Never prints clipboard contents, license keys, analytics identifiers or
#     preference values.
#   * Never uses rm -rf and never touches unrelated Application Support files.
#   * Does not install dependencies.
#
# Usage: bash capture/seed-fixtures.sh --backup-dir /abs/path [--dry-run]

set -euo pipefail

DOMAIN="com.kienvt.DeskUtils"
APP_NAME="DeskUtils"
HELPER_NAME="DeskUtilsDisplayRecovery"
HOME_DIR="${HOME:?HOME must be set}"
APP_SUPPORT_DIR="$HOME_DIR/Library/Application Support/DeskUtils"
MANIFEST_NAME="manifest.tsv"
FILE_ITEMS=(clipboard_history.json ClipboardImages History Thumbnails Captures)

DEMO_IMAGE_NAME="11111111-1111-1111-1111-111111111111.png"

DRY_RUN=0
BACKUP_DIR=""
TEMP_BMP=""

usage() {
  cat <<EOF
DeskUtils capture fixture seeder (reversible)

Usage:
  bash capture/seed-fixtures.sh --backup-dir <absolute-path> [--dry-run]

Required:
  --backup-dir <path>  Absolute directory to receive the backup and manifest.
                       Never chosen automatically. Must not already contain a
                       manifest.

Options:
  --dry-run            Show planned actions; change nothing.
  -h, --help           Show this help and exit.

What is backed up (only DeskUtils state the capture workflow may change):
  * the com.kienvt.DeskUtils UserDefaults domain (opaque snapshot)
  * Clipboard History JSON and ClipboardImages/ assets
  * screenshot history (History/, Thumbnails/) and capture output (Captures/)

What is written (deterministic, fictional demo data only):
  * clipboard text / link / generated poster, with one pinned item
  * color recents, enabled modules, onboarding dismissed, analytics disabled

This script never modifies the DeskUtils source repository and never launches
the app. See docs/fixture-workflow.md.
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
die() { printf '%s[FAIL]%s %s\n' "$C_FAIL" "$C_RESET" "$*" >&2; exit 1; }
die_usage() { printf 'Error: %s\n\n' "$*" >&2; usage >&2; exit 2; }

cleanup() {
  if [ -n "$TEMP_BMP" ] && [ -f "$TEMP_BMP" ]; then
    rm -f -- "$TEMP_BMP"
  fi
}
trap cleanup EXIT

need_value() {
  [ "$#" -ge 2 ] || die_usage "missing value for option: $1"
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --backup-dir)
        need_value "$@"
        BACKUP_DIR="$2"
        shift 2
        ;;
      --backup-dir=*)
        BACKUP_DIR="${1#*=}"
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

validate() {
  [ -n "$BACKUP_DIR" ] || die_usage "--backup-dir is required and never chosen automatically"
  case "$BACKUP_DIR" in
    /*) ;;
    *) die "--backup-dir must be an absolute path" ;;
  esac
  case "$BACKUP_DIR" in
    "$APP_SUPPORT_DIR"|"$APP_SUPPORT_DIR"/*)
      die "--backup-dir must not be inside $APP_SUPPORT_DIR"
      ;;
  esac
  if [ "$(id -u)" -eq 0 ]; then
    die "refusing to run as root; run as the target macOS user"
  fi
  if [ -e "$BACKUP_DIR/$MANIFEST_NAME" ]; then
    die "a backup manifest already exists in $BACKUP_DIR; refusing to overwrite it"
  fi
}

require_no_process() {
  local found=""
  if pgrep -x "$APP_NAME" >/dev/null 2>&1; then
    found="$APP_NAME"
  fi
  if pgrep -x "$HELPER_NAME" >/dev/null 2>&1; then
    found="$HELPER_NAME"
  fi
  if pgrep -f "DeskUtils.app/Contents/MacOS/DeskUtils" >/dev/null 2>&1; then
    found="DeskUtils app (path match)"
  fi
  if [ -n "$found" ]; then
    if [ "$DRY_RUN" -eq 1 ]; then
      log_warn "DeskUtils appears active ($found); dry-run continues without changing anything"
    else
      die "DeskUtils is running ($found). Quit it completely before seeding."
    fi
  else
    log_pass "No DeskUtils process is running"
  fi
}

append_manifest() {
  local item="$1" state="$2"
  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] manifest: $item=$state"
    return 0
  fi
  printf '%s\t%s\n' "$item" "$state" >> "$BACKUP_DIR/$MANIFEST_NAME"
}

perform_backup() {
  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] would create backup directory: $BACKUP_DIR"
  else
    mkdir -p "$BACKUP_DIR/files"
    : > "$BACKUP_DIR/$MANIFEST_NAME"
    log_pass "Backup directory ready: $BACKUP_DIR"
  fi

  if defaults read "$DOMAIN" >/dev/null 2>&1; then
    append_manifest "userdefaults" "present"
    if [ "$DRY_RUN" -eq 1 ]; then
      log_info "[dry-run] would export the $DOMAIN UserDefaults domain (opaque; values not printed)"
    else
      defaults export "$DOMAIN" "$BACKUP_DIR/userdefaults.plist"
      log_pass "Backed up UserDefaults domain (opaque snapshot)"
    fi
  else
    append_manifest "userdefaults" "absent"
    log_info "No existing $DOMAIN UserDefaults domain to back up"
  fi

  local item src
  for item in "${FILE_ITEMS[@]}"; do
    src="$APP_SUPPORT_DIR/$item"
    if [ -e "$src" ]; then
      append_manifest "$item" "present"
      if [ "$DRY_RUN" -eq 1 ]; then
        log_info "[dry-run] would back up $item"
      else
        if [ -d "$src" ]; then
          ditto "$src" "$BACKUP_DIR/files/$item"
        else
          cp -p "$src" "$BACKUP_DIR/files/$item"
        fi
        log_pass "Backed up $item"
      fi
    else
      append_manifest "$item" "absent"
      log_info "No existing $item to back up"
    fi
  done
}

esc_hex() {
  printf -v "$1" '\\x%02x' "$2"
}

le32() {
  local v="$1" b0 b1 b2 b3
  printf -v b0 '\\x%02x' $(( v & 255 ))
  printf -v b1 '\\x%02x' $(( (v >> 8) & 255 ))
  printf -v b2 '\\x%02x' $(( (v >> 16) & 255 ))
  printf -v b3 '\\x%02x' $(( (v >> 24) & 255 ))
  printf '%b' "$b0$b1$b2$b3"
}

le16() {
  local v="$1" b0 b1
  printf -v b0 '\\x%02x' $(( v & 255 ))
  printf -v b1 '\\x%02x' $(( (v >> 8) & 255 ))
  printf '%b' "$b0$b1"
}

generate_demo_poster() {
  local out_png="$1"
  local w=320 h=200
  local rowbytes=$(( w * 3 ))
  local datasize=$(( rowbytes * h ))
  local filesize=$(( 54 + datasize ))

  TEMP_BMP="$(mktemp -t deskutils-demo-poster)"

  {
    printf 'BM'
    le32 "$filesize"
    le32 0
    le32 54
    le32 40
    le32 "$w"
    le32 "$h"
    le16 1
    le16 24
    le32 0
    le32 "$datasize"
    le32 2835
    le32 2835
    le32 0
    le32 0

    local y x r g b pr pg pb
    for (( y = 0; y < h; y++ )); do
      for (( x = 0; x < w; x++ )); do
        r=$(( 10 + (x * 235) / (w - 1) ))
        g=$(( 60 + (y * 160) / (h - 1) ))
        b=$(( 200 - (x * 140) / (w - 1) ))
        esc_hex pr "$b"
        esc_hex pg "$g"
        esc_hex pb "$r"
        printf '%b' "$pr$pg$pb"
      done
    done
  } > "$TEMP_BMP"

  sips -s format png "$TEMP_BMP" --out "$out_png" >/dev/null
  sips -z 800 1200 "$out_png" >/dev/null
  rm -f -- "$TEMP_BMP"
  TEMP_BMP=""
}

color_recents_json() {
  cat <<'JSON'
[{"id":"a1111111-1111-1111-1111-111111111111","color":{"red":0.0392156862745098,"green":0.5176470588235295,"blue":1.0,"alpha":1.0}},
{"id":"a2222222-2222-2222-2222-222222222222","color":{"red":1.0,"green":0.6235294117647059,"blue":0.0392156862745098,"alpha":1.0}},
{"id":"a3333333-3333-3333-3333-333333333333","color":{"red":0.7490196078431373,"green":0.3529411764705883,"blue":0.9490196078431373,"alpha":1.0}},
{"id":"a4444444-4444-4444-4444-444444444444","color":{"red":0.1882352941176471,"green":0.8196078431372549,"blue":0.3450980392156863,"alpha":1.0}}]
JSON
}

write_clipboard_history() {
  local image_name="$1" bytes="$2" sha="$3"
  local out="$APP_SUPPORT_DIR/clipboard_history.json"
  cat > "$out" <<EOF
[
  {
    "id": "22222222-2222-2222-2222-222222222222",
    "content": { "type": "text", "text": "DeskUtils demo: order DU-1042 is ready." },
    "date": 780000000,
    "isPinned": false,
    "sourceApplication": { "bundleIdentifier": "com.apple.Notes", "displayName": "Notes" }
  },
  {
    "id": "33333333-3333-3333-3333-333333333333",
    "content": { "type": "link", "text": "https://example.com/deskutils-demo" },
    "date": 780000100,
    "isPinned": true,
    "sourceApplication": { "bundleIdentifier": "com.apple.Safari", "displayName": "Safari" }
  },
  {
    "id": "44444444-4444-4444-4444-444444444444",
    "content": {
      "type": "image",
      "image": {
        "fileName": "$image_name",
        "pixelWidth": 1200,
        "pixelHeight": 800,
        "byteCount": $bytes,
        "sha256": "$sha"
      }
    },
    "date": 779999900,
    "isPinned": false,
    "sourceApplication": { "bundleIdentifier": "com.apple.Preview", "displayName": "Preview" }
  }
]
EOF
  chmod 600 "$out" 2>/dev/null || true
}

apply_fixtures() {
  local recents_hex
  recents_hex="$(color_recents_json | xxd -p | tr -d '\n')"

  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] would write managed UserDefaults (onboarding dismissed, analytics disabled, enabled modules, color recents, quick ring)"
    log_info "[dry-run] would generate a demo poster and write clipboard_history.json with text, link, image and a pinned item"
    return 0
  fi

  defaults write "$DOMAIN" com.deskutils.onboarding.completedVersion -int 1
  defaults write "$DOMAIN" com.deskutils.analytics.enabled -bool false
  defaults write "$DOMAIN" com.deskutils.enabledModules \
    -dict clipboard -bool true \
          colorPicker -bool true \
          ocr -bool true \
          screenshot -bool true \
          systemMonitoring -bool true \
          preventSleep -bool true \
          quickRing -bool true \
          cleanKeyboard -bool false \
          externalDisplayDimming -bool false \
          externalDisplayOnly -bool false
  defaults write "$DOMAIN" colorPicker.recentColors -data "$recents_hex"
  defaults write "$DOMAIN" quickRing.position -string cursor
  defaults write "$DOMAIN" quickRing.doubleCommandEnabled -bool true
  defaults write "$DOMAIN" quickRing.hapticsEnabled -bool false
  log_pass "Wrote managed UserDefaults (values not printed)"

  mkdir -p "$APP_SUPPORT_DIR/ClipboardImages"
  local image_path="$APP_SUPPORT_DIR/ClipboardImages/$DEMO_IMAGE_NAME"
  generate_demo_poster "$image_path"

  local bytes sha
  bytes="$(wc -c < "$image_path" | tr -d ' ')"
  sha="$(shasum -a 256 "$image_path" | awk '{print $1}')"
  write_clipboard_history "$DEMO_IMAGE_NAME" "$bytes" "$sha"
  log_pass "Wrote clipboard fixtures and generated demo poster ($DEMO_IMAGE_NAME)"
}

main() {
  parse_args "$@"
  validate

  printf '%sDeskUtils fixture seeder%s%s\n' "$C_DIM" "$C_RESET" "$([ "$DRY_RUN" -eq 1 ] && echo ' (dry-run)')"
  printf 'Backup dir : %s\n' "$BACKUP_DIR"

  require_no_process
  perform_backup
  apply_fixtures

  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "Dry-run complete; nothing was changed."
  else
    log_pass "Seeding complete. Launch the Debug app to capture, then run restore-state.sh with the same --backup-dir."
  fi
}

main "$@"
