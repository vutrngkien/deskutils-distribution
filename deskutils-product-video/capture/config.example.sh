# DeskUtils capture preflight configuration (EXAMPLE)
#
# Copy this file to capture/config.sh and edit it, or simply export the
# variables in your shell before running:
#
#   bash capture/preflight.sh
#
# capture/preflight.sh sources capture/config.sh automatically when present.
# Every setting below uses "${VAR:-default}", so exported environment
# variables and command-line flags still take precedence.
#
# This file is configuration only: it must not run commands, request
# permissions, or touch the DeskUtils repository.

# Path to the DeskUtils source repository (read-only during preflight).
DESKUTILS_SOURCE="${DESKUTILS_SOURCE:-/Users/vukien/workspace/DeskUtils}"

# DerivedData location for the future Debug capture build.
DESKUTILS_DERIVED_DATA="${DESKUTILS_DERIVED_DATA:-/tmp/DeskUtilsCapture}"

# Optional explicit app bundle to inspect. Leave unset to derive it as
#   <DESKUTILS_DERIVED_DATA>/Build/Products/Debug/DeskUtils.app
# Setting this pins the path and disables the derived default.
# DESKUTILS_APP="${DESKUTILS_APP:-}"

# Capture work directory for future recordings (checked, never created here).
CAPTURE_WORK_DIR="${CAPTURE_WORK_DIR:-/tmp/deskutils-capture}"

# Where captured clips will be placed for the Remotion project. Defaults to
# <remotion-project>/public/footage; preflight never creates it.
# CAPTURE_FOOTAGE_DIR="${CAPTURE_FOOTAGE_DIR:-}"

# Expected values used for source verification. Usually no need to change.
EXPECTED_BUNDLE_ID="${EXPECTED_BUNDLE_ID:-com.kienvt.DeskUtils}"
EXPECTED_SCHEME="${EXPECTED_SCHEME:-DeskUtilsDev}"
