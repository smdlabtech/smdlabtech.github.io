#!/usr/bin/env bash
# ============================================================
# Lance le backend (port 8080) puis le frontend (port 3000) dans un seul terminal.
# Arrêt avec Ctrl+C : le backend est tué automatiquement.
# Usage: depuis la racine du repo → ./scripts/dev/run-all.sh
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

if [ ! -f "$REPO_ROOT/backend/main.py" ] || [ ! -f "$REPO_ROOT/frontend/app.py" ]; then
  echo "❌ backend/main.py ou frontend/app.py introuvable"
  exit 1
fi

BACKEND_PID=""
cleanup() {
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo ""
    echo "Arrêt du backend (PID $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup EXIT INT TERM

echo "=============================================="
echo "  Backend (FastAPI) → http://localhost:8080"
echo "  Frontend (Flask)  → http://localhost:3000"
echo "=============================================="
echo "  API   : http://localhost:8080/docs"
echo "  Health: http://localhost:8080/health"
echo "  Ctrl+C pour tout arrêter"
echo "=============================================="
echo ""

uvicorn backend.main:app --reload --port 8080 &
BACKEND_PID=$!

echo "⏳ Attente du backend..."
READY=0
for _ in $(seq 1 20); do
  if curl -fsS --max-time 2 "http://localhost:8080/health" >/dev/null 2>&1; then
    READY=1
    break
  fi
  sleep 1
done

if [ "$READY" -ne 1 ]; then
  echo "❌ Backend non prêt sur http://localhost:8080/health"
  echo "   Vérifie les logs backend avant de lancer le frontend."
  exit 1
fi

export BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
flask --app frontend.app run --port 3000
