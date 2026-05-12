#!/usr/bin/env bash
set -euo pipefail
exec "$(dirname "$0")/i18n/validate_translations.sh" "$@"
