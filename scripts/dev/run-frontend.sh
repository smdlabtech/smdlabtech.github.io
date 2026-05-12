#!/usr/bin/env bash
# ============================================================
# Lance le frontend Flask sur le port 3000 (backend attendu sur 8080)
# Usage: depuis la racine du repo → ./scripts/dev/run-frontend.sh
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

if [ ! -f "$REPO_ROOT/frontend/app.py" ]; then
  echo "❌ frontend/app.py introuvable"
  exit 1
fi

export BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"

echo "Frontend (Flask) → http://localhost:3000"
echo "  Backend attendu : $BACKEND_URL"
echo ""
exec flask --app frontend.app run --port 3000
