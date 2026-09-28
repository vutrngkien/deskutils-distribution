#!/usr/bin/env bash
#
# DeskUtils capture state restorer (reversible)
# ============================================
# Restores exactly the DeskUtils state that capture/seed-fixtures.sh backed up,
# using the manifest in the same --backup-dir. After this runs, the user's
# pre-capture DeskUtils state (including any license state) is back in place.
#
# Safety:
#   * Requires the same explicit --backup-dir used by seed-fixtures.sh.
#   * Restores only items recorded in the backup manifest.
#   * Refuses to run while any DeskUtils process is active.
#   * Never prints clipboard contents, license keys, analytics identifiers or
#     preference values.
#   * Never uses rm -rf; path removal is guarded to the current user's
#     DeskUtils Application Support directory.
#   * Does not install dependencies and does not touch the DeskUtils source.
#
# Usage: bash capture/restore-state.sh --backup-dir /abs/path [--dry-run]

set -euo pipefail

DOMAIN="com.kienvt.DeskUtils"
APP_NAME="DeskUtils"
HELPER_NAME="DeskUtilsDisplayRecovery"
HOME_DIR="${HOME:?HOME must be set}"
APP_SUPPORT_DIR="$HOME_DIR/Library/Application Support/DeskUtils"
MANIFEST_NAME="manifest.tsv"

DRY_RUN=0
BACKUP_DIR=""

usage() {
  cat <<EOF
DeskUtils capture state restorer (reversible)

Usage:
  bash capture/restore-state.sh --backup-dir <absolute-path> [--dry-run]

Required:
  --backup-dir <path>  The same absolute directory used by seed-fixtures.sh,
                       containing manifest.tsv and the backup.

Options:
  --dry-run            Show planned actions; change nothing.
  -h, --help           Show this help and exit.

The manifest decides what is restored; only items seed-fixtures.sh backed up are
touched. Items recorded as "absent" before seeding are removed. See
docs/fixture-workflow.md.
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
  [ -n "$BACKUP_DIR" ] || die_usage "--backup-dir is required and must match the one used by seed-fixtures.sh"
  case "$BACKUP_DIR" in
    /*) ;;
    *) die "--backup-dir must be an absolute path" ;;
  esac
  if [ "$(id -u)" -eq 0 ]; then
    die "refusing to run as root; run as the target macOS user"
  fi
  [ -d "$BACKUP_DIR" ] || die "backup directory not found: $BACKUP_DIR"
  [ -f "$BACKUP_DIR/$MANIFEST_NAME" ] || die "no backup manifest found in $BACKUP_DIR"
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
      die "DeskUtils is running ($found). Quit it completely before restoring."
    fi
  else
    log_pass "No DeskUtils process is running"
  fi
}

safe_remove_path() {
  local target="$1"
  if [ -z "$target" ]; then
    log_fail_guard "refusing to remove an empty path"
    return 1
  fi
  case "$target" in
    "$APP_SUPPORT_DIR"/*) ;;
    *)
      log_fail_guard "refusing to remove a path outside $APP_SUPPORT_DIR: $target"
      return 1
      ;;
  esac
  if [ -L "$target" ]; then
    log_fail_guard "refusing to remove a symlink: $target"
    return 1
  fi
  if [ ! -e "$target" ]; then
    return 0
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "[dry-run] would remove $target"
    return 0
  fi
  if [ -d "$target" ]; then
    rm -r -- "$target"
  else
    rm -- "$target"
  fi
}

log_fail_guard() { printf '%s[FAIL]%s %s\n' "$C_FAIL" "$C_RESET" "$*" >&2; }

restore_userdefaults() {
  local state="$1"
  if [ "$state" = "present" ]; then
    if [ ! -f "$BACKUP_DIR/userdefaults.plist" ]; then
      log_warn "manifest records userdefaults present but the snapshot is missing; skipping"
      return 0
    fi
    if [ "$DRY_RUN" -eq 1 ]; then
      log_info "[dry-run] would import the UserDefaults snapshot (opaque; values not printed)"
    else
      defaults import "$DOMAIN" "$BACKUP_DIR/userdefaults.plist"
      log_pass "Restored UserDefaults domain (opaque snapshot)"
    fi
  else
    if [ "$DRY_RUN" -eq 1 ]; then
      log_info "[dry-run] would delete the seeded UserDefaults domain $DOMAIN"
    else
      defaults delete "$DOMAIN" >/dev/null 2>&1 || true
      log_pass "Removed seeded UserDefaults domain (none existed before)"
    fi
  fi
}

restore_file_item() {
  local item="$1" state="$2"
  local target="$APP_SUPPORT_DIR/$item"
  local backup_path="$BACKUP_DIR/files/$item"

  if [ "$state" = "present" ]; then
    if [ ! -e "$backup_path" ]; then
      log_warn "manifest records $item present but the backup is missing; skipping"
      return 0
    fi
    safe_remove_path "$target"
    if [ "$DRY_RUN" -eq 1 ]; then
      log_info "[dry-run] would restore $item"
      return 0
    fi
    mkdir -p "$APP_SUPPORT_DIR"
    if [ -d "$backup_path" ]; then
      ditto "$backup_path" "$target"
    else
      cp -p "$backup_path" "$target"
    fi
    log_pass "Restored $item"
  else
    safe_remove_path "$target"
    if [ "$DRY_RUN" -eq 1 ]; then
      log_info "[dry-run] would leave absent $item (removed if seeded)"
    else
      log_pass "Removed $item (none existed before seeding)"
    fi
  fi
}

main() {
  parse_args "$@"
  validate

  printf '%sDeskUtils state restorer%s%s\n' "$C_DIM" "$C_RESET" "$([ "$DRY_RUN" -eq 1 ] && echo ' (dry-run)')"
  printf 'Backup dir : %s\n' "$BACKUP_DIR"

  require_no_process

  local item state
  while IFS=$'\t' read -r item state; do
    [ -n "$item" ] || continue
    case "$item" in
      userdefaults)
        restore_userdefaults "$state"
        ;;
      *)
        restore_file_item "$item" "$state"
        ;;
    esac
  done < "$BACKUP_DIR/$MANIFEST_NAME"

  if [ "$DRY_RUN" -eq 1 ]; then
    log_info "Dry-run complete; nothing was changed."
  else
    log_pass "Restore complete. DeskUtils state matches the pre-seed snapshot."
  fi
}

main "$@"
