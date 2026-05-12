#!/usr/bin/env bash
# ============================================================
# Configure l'environnement de dev : venv, deps Python, optionnel Jekyll
# Usage: depuis la racine du repo → ./scripts/dev/setup_complete.sh
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
APP_DIR="$REPO_ROOT/backend/app"
cd "$REPO_ROOT"

echo "📁 Racine du repo: $REPO_ROOT"
echo ""

# ---- Venv Python (backend/app/) ----
if [ ! -d "$APP_DIR/.venv" ] && [ ! -d "$APP_DIR/venv" ]; then
  echo "📦 Création du venv dans backend/app/.venv"
  python3 -m venv "$APP_DIR/.venv"
  source "$APP_DIR/.venv/bin/activate"
else
  if [ -d "$APP_DIR/.venv" ]; then source "$APP_DIR/.venv/bin/activate"
  else source "$APP_DIR/venv/bin/activate"; fi
fi

echo "📦 Installation des dépendances Python (Jekyll+Flask dans backend/app/)"
pip install -q --upgrade pip
pip install -q -r "$APP_DIR/requirements.txt"
if [ -f "$APP_DIR/requirements-dev.txt" ]; then
  pip install -q -r "$APP_DIR/requirements-dev.txt"
fi
echo "✅ Dépendances Python OK"
echo ""

# ---- Jekyll (optionnel) ----
if command -v bundle &>/dev/null && [ -f "$APP_DIR/Gemfile" ]; then
  echo "📦 Installation des dépendances Jekyll (backend/app/)"
  (cd "$APP_DIR" && bundle config set path 'vendor/bundle' 2>/dev/null || true && bundle install -q)
  echo "✅ Jekyll bundle OK"
else
  echo "⚠️  Ruby/Bundle non trouvé ou pas de Gemfile — Jekyll ignoré."
fi
echo ""

echo "✅ Setup terminé. Pour lancer :"
echo "   Flask : ./scripts/dev/launch_app.sh  ou  make run-flask"
echo "   Jekyll: cd backend/app && bundle exec jekyll serve  ou  make run-jekyll"
echo ""
