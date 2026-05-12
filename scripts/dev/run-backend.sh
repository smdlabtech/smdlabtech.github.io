#!/usr/bin/env bash
# ============================================================
# Lance le backend FastAPI sur le port 8080
# Usage: depuis la racine du repo → ./scripts/dev/run-backend.sh
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Activer un venv s'il existe
if [ -d "$REPO_ROOT/.venv" ]; then
  source "$REPO_ROOT/.venv/bin/activate"
elif [ -d "$REPO_ROOT/backend/app/.venv" ]; then
  source "$REPO_ROOT/backend/app/.venv/bin/activate"
elif [ -d "$REPO_ROOT/venv" ]; then
  source "$REPO_ROOT/venv/bin/activate"
fi

if [ ! -f "$REPO_ROOT/backend/main.py" ]; then
  echo "❌ backend/main.py introuvable"
  exit 1
fi

PORT="${PORT:-8080}"
PIDS_ON_PORT="$(lsof -t -nP -iTCP:${PORT} -sTCP:LISTEN 2>/dev/null || true)"
if [ -n "$PIDS_ON_PORT" ]; then
  echo "❌ Port ${PORT} déjà utilisé (PID(s): ${PIDS_ON_PORT})"
  echo "   Libère le port avec : kill ${PIDS_ON_PORT}"
  echo "   Ou utilise : ./shut-down-all-ports.sh"
  exit 1
fi

echo "Backend (FastAPI) → http://localhost:${PORT}"
echo "  API   : http://localhost:${PORT}/docs"
echo "  Health: http://localhost:${PORT}/health"
echo ""
exec uvicorn backend.main:app --reload --port "${PORT}"
