#!/bin/bash
# Script pour tester l'application Flask
# Usage: ./scripts/test_app.sh [unit|integration|all]

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

TEST_TYPE=${1:-all}

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     🧪 Tests de l'Application Flask                  ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Vérifier que l'environnement virtuel existe
if [ ! -d "venv" ]; then
    echo -e "${RED}❌ Environnement virtuel non trouvé${NC}"
    echo -e "${YELLOW}💡 Exécutez d'abord: ./scripts/setup_complete.sh${NC}\n"
    exit 1
fi

# Activer l'environnement virtuel
echo -e "${GREEN}🔌 Activation de l'environnement virtuel...${NC}"
source venv/bin/activate

# Vérifier que pytest est installé
if ! python -c "import pytest" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  pytest non trouvé, installation...${NC}"
    cd app
    pip install -r requirements-dev.txt --quiet
    cd ..
fi

# Configuration
export PYTHONPATH="$(pwd)/app:$PYTHONPATH"
export FLASK_ENV=testing

echo -e "${GREEN}📋 Configuration:${NC}"
echo -e "  Type de tests: ${BLUE}${TEST_TYPE}${NC}"
echo -e "  PYTHONPATH: ${BLUE}${PYTHONPATH}${NC}"
echo -e "  FLASK_ENV: ${BLUE}testing${NC}\n"

# Exécuter les tests selon le type
case "$TEST_TYPE" in
    unit)
        echo -e "${GREEN}🧪 Exécution des tests unitaires...${NC}\n"
        pytest tests/unit/ -v --cov=app/src --cov-report=term --cov-report=html
        ;;
    integration)
        echo -e "${GREEN}🧪 Exécution des tests d'intégration...${NC}\n"
        pytest tests/integration/ -v --cov=app/src --cov-report=term --cov-report=html
        ;;
    all|*)
        echo -e "${GREEN}🧪 Exécution de tous les tests...${NC}\n"
        pytest tests/ -v --cov=app/src --cov-report=term --cov-report=html
        ;;
esac

# Afficher le rapport de coverage
if [ -f "htmlcov/index.html" ]; then
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}📊 Rapport de coverage généré:${NC}"
    echo -e "   ${BLUE}htmlcov/index.html${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
fi

echo -e "${GREEN}✅ Tests terminés${NC}\n"
