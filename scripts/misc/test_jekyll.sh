#!/bin/bash
# Script pour tester rapidement la configuration Jekyll
# Usage: ./scripts/test_jekyll.sh

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     🧪 Test de Configuration Jekyll                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

ERRORS=0

# Test 1: Ruby
echo -e "${GREEN}Test 1/6: Ruby${NC}"
if command -v ruby &> /dev/null; then
    RUBY_VERSION=$(ruby --version)
    echo -e "✅ $RUBY_VERSION"
else
    echo -e "${RED}❌ Ruby non installé${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 2: Bundler
echo -e "${GREEN}Test 2/6: Bundler${NC}"
if command -v bundle &> /dev/null; then
    BUNDLER_VERSION=$(bundle --version)
    echo -e "✅ $BUNDLER_VERSION"
else
    echo -e "${RED}❌ Bundler non installé${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 3: Gemfile
echo -e "${GREEN}Test 3/6: Gemfile${NC}"
if [ -f "app/Gemfile" ]; then
    echo -e "✅ Gemfile trouvé"
else
    echo -e "${RED}❌ Gemfile non trouvé${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 4: _config.yml
echo -e "${GREEN}Test 4/6: _config.yml${NC}"
if [ -f "app/_config.yml" ]; then
    echo -e "✅ _config.yml trouvé"
else
    echo -e "${RED}❌ _config.yml non trouvé${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Test 5: Structure des dossiers
echo -e "${GREEN}Test 5/6: Structure des dossiers${NC}"
cd app

REQUIRED_DIRS=("_posts" "_layouts" "_includes" "_data")
MISSING_DIRS=()

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "✅ $dir/ trouvé"
    else
        echo -e "${RED}❌ $dir/ manquant${NC}"
        MISSING_DIRS+=("$dir")
        ERRORS=$((ERRORS + 1))
    fi
done

cd ..
echo ""

# Test 6: Dépendances installées
echo -e "${GREEN}Test 6/6: Dépendances Jekyll${NC}"
cd app

if [ -f "Gemfile.lock" ]; then
    echo -e "✅ Gemfile.lock trouvé"
    if bundle check &> /dev/null; then
        echo -e "✅ Dépendances installées et à jour"
    else
        echo -e "${YELLOW}⚠️  Dépendances non installées ou obsolètes${NC}"
        echo -e "${YELLOW}💡 Exécutez: bundle install${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  Gemfile.lock non trouvé${NC}"
    echo -e "${YELLOW}💡 Exécutez: bundle install${NC}"
    ERRORS=$((ERRORS + 1))
fi

cd ..
echo ""

# Résumé
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✅ Tous les tests sont passés !                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}\n"
    echo -e "${BLUE}🚀 Vous pouvez maintenant lancer Jekyll:${NC}"
    echo -e "   ${BLUE}./scripts/launch_jekyll.sh${NC}\n"
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ❌ $ERRORS erreur(s) détectée(s)                  ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}\n"
    echo -e "${YELLOW}💡 Actions recommandées:${NC}\n"

    if [ ${#MISSING_DIRS[@]} -gt 0 ]; then
        echo -e "1. Créer les dossiers manquants:"
        for dir in "${MISSING_DIRS[@]}"; do
            echo -e "   ${BLUE}mkdir -p app/$dir${NC}"
        done
        echo ""
    fi

    echo -e "2. Configurer Jekyll:"
    echo -e "   ${BLUE}./scripts/setup_jekyll.sh${NC}\n"

    exit 1
fi
