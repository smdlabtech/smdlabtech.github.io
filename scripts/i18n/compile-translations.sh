#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
source "${REPO_ROOT}/scripts/lib/common.sh"

print_help() {
  cat <<'EOF'
Usage:
  ./scripts/i18n/compile-translations.sh [translations_dir]

Default:
  translations_dir = backend/src/translations

What it does:
  - Validates HTML i18n keys first
  - Compiles gettext .po -> .mo when pybabel is available
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_help
  exit 0
fi

TARGET_DIR="${1:-backend/src/translations}"
cd "${REPO_ROOT}"

log_info "Running i18n validator before compilation..."
"${REPO_ROOT}/scripts/i18n/validate_translations.sh"

if command -v pybabel >/dev/null 2>&1; then
  log_info "Compiling gettext catalogs in ${TARGET_DIR}..."
  pybabel compile -d "${TARGET_DIR}"
  log_info "Compilation done."
else
  log_warn "pybabel not found; skipping gettext compilation."
fi
