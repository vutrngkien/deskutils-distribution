#!/usr/bin/env bash
#
# DeskUtils capture preflight (read-only diagnostic)
# ==================================================
# Checks that the host, toolchain, DeskUtils source, future Debug app path and
# built-in capture tools are ready for the approved native capture plan.
#
# READ-ONLY. This script never builds, signs, launches, seeds, records or
# renders anything, never requests macOS permissions, and never modifies the
# DeskUtils repository. It creates no directories.
#
# Usage: bash capture/preflight.sh [options]
# See docs/capture-preflight.md for details.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT="$(cd -- "$SCRIPT_DIR/.." >/dev/null 2>&1 && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config.sh"

# ---------------------------------------------------------------------------
# Defaults (environment variables take precedence; flags override both)
# ---------------------------------------------------------------------------
: "${DESKUTILS_SOURCE:=/Users/vukien/workspace/DeskUtils}"
: "${DESKUTILS_DERIVED_DATA:=/tmp/DeskUtilsCapture}"
: "${DESKUTILS_APP:=}"
: "${CAPTURE_WORK_DIR:=/tmp/deskutils-capture}"
: "${CAPTURE_FOOTAGE_DIR:=$PROJECT_ROOT/public/footage}"
: "${EXPECTED_BUNDLE_ID:=com.kienvt.DeskUtils}"
: "${EXPECTED_SCHEME:=DeskUtilsDev}"

usage() {
  cat <<EOF
DeskUtils capture preflight (read-only)

Usage:
  bash capture/preflight.sh [options]

Options:
  --source <path>        DeskUtils source repository
                         (env: DESKUTILS_SOURCE, default: /Users/vukien/workspace/DeskUtils)
  --derived-data <path>  DerivedData for the future Debug build
                         (env: DESKUTILS_DERIVED_DATA, default: /tmp/DeskUtilsCapture)
  --app <path>           Explicit .app bundle to check
                         (env: DESKUTILS_APP,
                          default: <derived-data>/Build/Products/Debug/DeskUtils.app)
  -h, --help             Show this help and exit

This script is a read-only diagnostic. It builds, launches, signs, seeds,
records and renders nothing, requests no macOS permissions, and never alters
the DeskUtils repository. It only reports PASS / WARN / FAIL with an exit code.

Exit codes:
  0  No missing prerequisites (warnings may still be present)
  1  A genuine prerequisite is missing
  2  Invalid command-line usage
EOF
}

# ---------------------------------------------------------------------------
# Optional local config (capture/config.sh). The example respects existing env.
# ---------------------------------------------------------------------------
if [ -f "$CONFIG_FILE" ]; then
  # shellcheck source=/dev/null
  . "$CONFIG_FILE"
fi

# ---------------------------------------------------------------------------
# Flag parsing (highest precedence)
# ---------------------------------------------------------------------------
need_value() {
  [ "$#" -ge 2 ] || {
    printf 'Missing value for option: %s\n' "$1" >&2
    usage >&2
    exit 2
  }
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --source)
      need_value "$@"
      DESKUTILS_SOURCE="$2"
      shift 2
      ;;
    --source=*)
      DESKUTILS_SOURCE="${1#*=}"
      shift
      ;;
    --derived-data)
      need_value "$@"
      DESKUTILS_DERIVED_DATA="$2"
      shift 2
      ;;
    --derived-data=*)
      DESKUTILS_DERIVED_DATA="${1#*=}"
      shift
      ;;
    --app)
      need_value "$@"
      DESKUTILS_APP="$2"
      shift 2
      ;;
    --app=*)
      DESKUTILS_APP="${1#*=}"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      printf 'Unknown option: %s\n\n' "$1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

# Derive the future Debug app path only when not explicitly provided.
if [ -z "$DESKUTILS_APP" ]; then
  DESKUTILS_APP="$DESKUTILS_DERIVED_DATA/Build/Products/Debug/DeskUtils.app"
fi

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------
if [ -t 1 ] && [ -z "${NO_COLOR:-}" ]; then
  C_PASS=$'\033[32m'
  C_WARN=$'\033[33m'
  C_FAIL=$'\033[31m'
  C_DIM=$'\033[2m'
  C_RESET=$'\033[0m'
else
  C_PASS=''
  C_WARN=''
  C_FAIL=''
  C_DIM=''
  C_RESET=''
fi

PASS_COUNT=0
WARN_COUNT=0
FAIL_COUNT=0

pass() { PASS_COUNT=$((PASS_COUNT + 1)); printf '%s[PASS]%s %s\n' "$C_PASS" "$C_RESET" "$*"; }
warn() { WARN_COUNT=$((WARN_COUNT + 1)); printf '%s[WARN]%s %s\n' "$C_WARN" "$C_RESET" "$*"; }
fail() { FAIL_COUNT=$((FAIL_COUNT + 1)); printf '%s[FAIL]%s %s\n' "$C_FAIL" "$C_RESET" "$*"; }
info() { printf '%s[INFO]%s %s\n' "$C_DIM" "$C_RESET" "$*"; }
section() { printf '\n%s== %s ==%s\n' "$C_DIM" "$1" "$C_RESET"; }
have() { command -v "$1" >/dev/null 2>&1; }

# ---------------------------------------------------------------------------
# Header
# ---------------------------------------------------------------------------
printf '%sDeskUtils capture preflight%s (read-only)\n' "$C_DIM" "$C_RESET"
printf 'Remotion project : %s\n' "$PROJECT_ROOT"
printf 'DeskUtils source : %s\n' "$DESKUTILS_SOURCE"
printf 'Derived data     : %s\n' "$DESKUTILS_DERIVED_DATA"
printf 'Future app       : %s\n' "$DESKUTILS_APP"

# ---------------------------------------------------------------------------
# 1. Host & toolchain
# ---------------------------------------------------------------------------
section "1. Host & toolchain"

if [ "$(uname -s)" = "Darwin" ]; then
  pass "macOS detected ($(sw_vers -productVersion 2>/dev/null || echo unknown))"
else
  fail "Not running macOS (uname=$(uname -s)); the capture plan targets macOS"
fi

if have xcodebuild; then
  if xcodebuild -version >/dev/null 2>&1; then
    pass "Xcode available: $(xcodebuild -version 2>/dev/null | head -n 1)"
  else
    warn "xcodebuild present but not usable (license not accepted, or Command Line Tools only)"
  fi
  info "Developer dir: $(xcode-select -p 2>/dev/null || echo unknown)"
else
  fail "xcodebuild not found (install Xcode 26.4.1+ and select it with xcode-select)"
fi

if have node; then
  pass "Node available: $(node -v 2>/dev/null)"
else
  fail "node not found (required by the Remotion project)"
fi

if have npm; then
  pass "npm available: $(npm -v 2>/dev/null)"
else
  fail "npm not found (required by the Remotion project)"
fi

# ---------------------------------------------------------------------------
# 2. Remotion project
# ---------------------------------------------------------------------------
section "2. Remotion project"

if [ -f "$PROJECT_ROOT/package.json" ]; then
  if grep -q '"remotion"' "$PROJECT_ROOT/package.json" 2>/dev/null; then
    pass "package.json declares a remotion dependency"
  else
    warn "package.json found but no 'remotion' dependency declared"
  fi
else
  fail "package.json not found in the Remotion project root"
fi

if [ -f "$PROJECT_ROOT/remotion.config.ts" ]; then
  pass "remotion.config.ts present"
else
  warn "remotion.config.ts not found"
fi

if [ -d "$PROJECT_ROOT/src" ]; then
  pass "Remotion source directory present (src/)"
else
  warn "src/ not found"
fi

if [ -d "$PROJECT_ROOT/node_modules/remotion" ] && [ -d "$PROJECT_ROOT/node_modules/@remotion/cli" ]; then
  pass "Remotion packages installed in node_modules/"
else
  warn "Remotion node_modules not installed (run npm install); not required for native capture itself"
fi

# ---------------------------------------------------------------------------
# 3. DeskUtils source, project and scheme
# ---------------------------------------------------------------------------
section "3. DeskUtils source, project and scheme"

PBXPROJ="$DESKUTILS_SOURCE/DeskUtils.xcodeproj/project.pbxproj"
SCHEME_PATH="$DESKUTILS_SOURCE/DeskUtils.xcodeproj/xcshareddata/xcschemes/$EXPECTED_SCHEME.xcscheme"
SOURCE_OK=0

if [ -d "$DESKUTILS_SOURCE" ]; then
  pass "Source directory found: $DESKUTILS_SOURCE"
  SOURCE_OK=1
else
  fail "Source directory not found: $DESKUTILS_SOURCE (set DESKUTILS_SOURCE or --source)"
fi

if [ -f "$PBXPROJ" ]; then
  pass "DeskUtils.xcodeproj present"
else
  fail "DeskUtils.xcodeproj/project.pbxproj not found"
fi

if [ -f "$SCHEME_PATH" ]; then
  pass "Shared scheme '$EXPECTED_SCHEME' present"
else
  fail "Shared scheme '$EXPECTED_SCHEME' not found at the expected path"
fi

if [ -f "$PBXPROJ" ] && grep -q "PRODUCT_BUNDLE_IDENTIFIER = $EXPECTED_BUNDLE_ID" "$PBXPROJ"; then
  pass "Expected bundle identifier '$EXPECTED_BUNDLE_ID' found in project"
else
  fail "Expected bundle identifier '$EXPECTED_BUNDLE_ID' not found in project"
fi

if [ "$SOURCE_OK" -eq 1 ] && grep -rq -- "--demo-mode" "$DESKUTILS_SOURCE/DeskUtils" 2>/dev/null; then
  pass "--demo-mode referenced in DeskUtils app source"
else
  fail "--demo-mode not found in DeskUtils app source"
fi

if [ -f "$SCHEME_PATH" ] && grep -q -- "--demo-mode" "$SCHEME_PATH" 2>/dev/null; then
  pass "'$EXPECTED_SCHEME' scheme injects --demo-mode automatically"
else
  warn "'$EXPECTED_SCHEME' scheme does not include --demo-mode; pass it manually when launching"
fi

# ---------------------------------------------------------------------------
# 4. Future Debug app path (not built by this script)
# ---------------------------------------------------------------------------
section "4. Future Debug app path (no build performed)"

if [ -d "$DESKUTILS_APP" ]; then
  pass "App bundle present: $DESKUTILS_APP"

  if [ -x "$DESKUTILS_APP/Contents/MacOS/DeskUtils" ]; then
    pass "App executable present inside the bundle"
  else
    fail "App executable missing inside the bundle (incomplete build)"
  fi

  if have codesign; then
    signature="$(codesign -dv --verbose=2 "$DESKUTILS_APP" 2>&1 || true)"
    if printf '%s' "$signature" | grep -q 'Signature=adhoc'; then
      warn "App is ad-hoc signed; TCC grants (Accessibility/Screen Recording) may not persist"
    elif printf '%s' "$signature" | grep -q 'Authority='; then
      pass "App is code signed (fixed-path grants can persist)"
    else
      warn "App is not signed; TCC grants may not persist"
    fi
  else
    warn "codesign tool unavailable; cannot inspect app signature"
  fi

  warn "Screen Recording & Accessibility are NOT verified here; grant them manually after launching the fixed-path signed build"
else
  warn "Debug app not built yet: $DESKUTILS_APP"
  info "Build later (outside this preflight) with:"
  info "  xcodebuild -project DeskUtils.xcodeproj -scheme $EXPECTED_SCHEME \\"
  info "    -configuration Debug -derivedDataPath $DESKUTILS_DERIVED_DATA build"
  warn "Screen Recording & Accessibility checks are deferred until a signed fixed-path build exists"
fi

# ---------------------------------------------------------------------------
# 5. Built-in capture tools
# ---------------------------------------------------------------------------
section "5. Built-in capture tools"

for tool in screencapture osascript open defaults tccutil; do
  if have "$tool"; then
    pass "$tool available: $(command -v "$tool")"
  else
    fail "$tool not found (required built-in macOS tool)"
  fi
done

# ---------------------------------------------------------------------------
# 6. Capture folders (checked only; never created here)
# ---------------------------------------------------------------------------
section "6. Capture folders (checked only; nothing created)"

check_future_dir() {
  local dir="$1"
  local label="$2"
  local parent=""
  if [ -d "$dir" ]; then
    pass "$label already exists: $dir"
    return
  fi
  parent="$(dirname -- "$dir")"
  if [ -d "$parent" ] && [ -w "$parent" ]; then
    pass "$label can be created later: $dir (parent is writable)"
  elif [ -d "$parent" ]; then
    warn "$label parent exists but is not writable: $parent"
  else
    warn "$label parent does not exist and will need to be created: $parent"
  fi
}

check_future_dir "$CAPTURE_WORK_DIR" "Capture work dir"
check_future_dir "$CAPTURE_FOOTAGE_DIR" "Footage output dir"
info "Preflight created nothing; these paths are only inspected."

# ---------------------------------------------------------------------------
# 7. DeskUtils source git status (warning only; never altered)
# ---------------------------------------------------------------------------
section "7. DeskUtils source git status (warning only; never altered)"

if have git && git -C "$DESKUTILS_SOURCE" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  changed_count="$(git -C "$DESKUTILS_SOURCE" status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
  changed_count="${changed_count:-0}"
  if [ "$changed_count" = "0" ]; then
    pass "Working tree is clean"
  else
    warn "Working tree has $changed_count changed/untracked path(s); leave as-is (no reset/stash/commit during capture)"
  fi
else
  warn "Not a git work tree (or git unavailable) at $DESKUTILS_SOURCE"
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
section "Summary"
printf 'PASS: %d   WARN: %d   FAIL: %d\n' "$PASS_COUNT" "$WARN_COUNT" "$FAIL_COUNT"

if [ "$FAIL_COUNT" -gt 0 ]; then
  printf '%sRESULT: FAIL%s — %d genuine prerequisite(s) missing.\n' "$C_FAIL" "$C_RESET" "$FAIL_COUNT"
  exit 1
fi

printf '%sRESULT: OK%s — no missing prerequisites. Warnings are expected before the app is built and before permissions are granted.\n' "$C_PASS" "$C_RESET"
exit 0
