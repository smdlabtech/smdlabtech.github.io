#!/usr/bin/env bash
# ============================================================
# Tester l'application en local avant push en prod
# Usage: depuis la racine du repo → ./app/scripts/test-local.sh
#        ou depuis app/ → ./scripts/test-local.sh
# ============================================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Script est dans app/scripts/ → racine du repo = parent de app
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
APP_DIR="$REPO_ROOT/app"
cd "$REPO_ROOT"

echo "📁 Racine du repo: $REPO_ROOT"
echo ""

# ---- 1. Tests Python ----
echo "=========================================="
echo "1️⃣  Tests unitaires et d'intégration"
echo "=========================================="
VENV_ACTIVATED=
if [ -d "$APP_DIR/.venv" ]; then
  source "$APP_DIR/.venv/bin/activate"
  VENV_ACTIVATED=1
elif [ -d "$REPO_ROOT/.venv" ]; then
  source "$REPO_ROOT/.venv/bin/activate"
  VENV_ACTIVATED=1
fi

# S'assurer que pytest est installé (requirements-dev.txt)
if [ -n "$VENV_ACTIVATED" ] && ! python -m pytest --version &>/dev/null; then
  echo "Installation des dépendances de test (pytest, etc.)..."
  pip install -q -r "$APP_DIR/requirements.txt" -r "$APP_DIR/requirements-dev.txt"
fi

if command -v python3 &>/dev/null; then
  PYTHONPATH=app python3 -m pytest tests/ -v --tb=short
else
  PYTHONPATH=app python -m pytest tests/ -v --tb=short
fi
echo "✅ Tests OK"
echo ""

# ---- 2. Build Jekyll (vérification) ----
echo "=========================================="
echo "2️⃣  Build Jekyll (vérification)"
echo "=========================================="
cd "$APP_DIR"
if ! command -v bundle &>/dev/null; then
  echo "⚠️  Ruby/Bundle non trouvé. Installez Ruby puis: cd app && bundle install"
  echo "   Jekyll sera ignoré pour ce run."
else
  bundle config set path 'vendor/bundle' 2>/dev/null || true
  bundle install --quiet
  bundle exec jekyll build --quiet
  echo "✅ Build Jekyll OK (sortie dans app/_site/)"
fi
cd "$REPO_ROOT"
echo ""

# ---- 3. Instructions pour lancer en local ----
echo "=========================================="
echo "3️⃣  Lancer l’app en local (manuel)"
echo "=========================================="
echo ""
echo "Frontend (Jekyll) – site statique :"
echo "  cd app"
echo "  bundle exec jekyll serve"
echo "  → Ouvrir http://localhost:4000"
echo ""
echo "Backend (Flask) – optionnel, si vous utilisez l’API :"
echo "  cd app"
echo "  source .venv/bin/activate   # ou .venv\\Scripts\\activate sur Windows"
echo "  pip install -r requirements.txt -r requirements-dev.txt  # dev pour pytest"
echo "  python run.py"
echo "  → API sur http://localhost:8080"
echo ""
echo "✅ Vous pouvez maintenant tester dans le navigateur puis pousser en prod."
echo ""
