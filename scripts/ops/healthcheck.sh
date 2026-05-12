#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
source "${REPO_ROOT}/scripts/lib/common.sh"

FASTAPI_URL="${FASTAPI_URL:-http://localhost:8080}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
JEKYLL_URL="${JEKYLL_URL:-http://localhost:4000}"

print_help() {
  cat <<'EOF'
Usage:
  ./scripts/ops/healthcheck.sh

Env:
  FASTAPI_URL=http://localhost:8080
  FRONTEND_URL=http://localhost:3000
  JEKYLL_URL=http://localhost:4000
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  print_help
  exit 0
fi

require_cmd curl

log_info "Checking FastAPI health: ${FASTAPI_URL}/health"
if curl -sf --max-time 5 "${FASTAPI_URL}/health" >/dev/null; then
  log_info "FastAPI OK"
else
  log_error "FastAPI unreachable (run: ./scripts/dev/run-backend.sh)"
  exit 1
fi

log_info "Checking Flask frontend: ${FRONTEND_URL}/"
if curl -sf --max-time 5 "${FRONTEND_URL}/" >/dev/null; then
  log_info "Frontend Flask OK"
else
  log_warn "Frontend Flask unreachable (run: ./scripts/dev/run-frontend.sh)"
fi

log_info "Checking Jekyll legacy: ${JEKYLL_URL}/"
if curl -sf --max-time 3 "${JEKYLL_URL}/" >/dev/null; then
  log_info "Jekyll legacy OK"
else
  log_warn "Jekyll legacy unreachable (optional)."
fi

log_info "Healthcheck completed."
