#!/usr/bin/env bash
# ============================================================
# Lance les tests pytest (depuis la racine du repo)
# Usage: ./scripts/quality/run_tests.sh [pytest-args...]
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

export PYTHONPATH="${PYTHONPATH:-}:$REPO_ROOT/app"
if command -v python3 &>/dev/null; then
  exec python3 -m pytest tests/ -v "$@"
else
  exec python -m pytest tests/ -v "$@"
fi
