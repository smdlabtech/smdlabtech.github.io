#!/usr/bin/env bash
# ============================================================
# Lance l'application Flask (backend/app/) sur le port 8080
# Usage: depuis la racine du repo → ./scripts/dev/launch_app.sh
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
APP_DIR="$REPO_ROOT/backend/app"
cd "$REPO_ROOT"

# Activer le venv s'il existe (backend/app/.venv ou venv)
if [ -d "$APP_DIR/.venv" ]; then
  source "$APP_DIR/.venv/bin/activate"
elif [ -d "$APP_DIR/venv" ]; then
  source "$APP_DIR/venv/bin/activate"
elif [ -d "$REPO_ROOT/.venv" ]; then
  source "$REPO_ROOT/.venv/bin/activate"
fi

if [ ! -f "$APP_DIR/run.py" ]; then
  echo "❌ run.py introuvable dans $APP_DIR"
  exit 1
fi

export PYTHONPATH="$APP_DIR"
export FLASK_ENV="${FLASK_ENV:-development}"
export PORT="${PORT:-8080}"

echo "🚀 Lancement Flask (backend/app/) — port $PORT"
cd "$APP_DIR"
exec python run.py
