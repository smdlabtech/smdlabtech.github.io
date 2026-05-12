#!/bin/bash
# Script pour vérifier les dépendances et résoudre les conflits
# Usage: ./scripts/check_dependencies.sh

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification des dépendances...${NC}\n"

# Activer l'environnement virtuel si disponible
if [ -d "venv" ]; then
    source venv/bin/activate
    echo -e "${GREEN}✅ Environnement virtuel activé${NC}\n"
fi

# Vérifier pip
if ! command -v pip &> /dev/null; then
    echo -e "${RED}❌ pip n'est pas installé${NC}"
    exit 1
fi

# Vérifier les fichiers requirements
if [ ! -f "backend/app/requirements.txt" ]; then
    echo -e "${RED}❌ backend/app/requirements.txt n'existe pas${NC}"
    exit 1
fi

echo -e "${GREEN}📋 Fichiers requirements trouvés${NC}"
echo -e "  - backend/app/requirements.txt"
if [ -f "backend/app/requirements-dev.txt" ]; then
    echo -e "  - backend/app/requirements-dev.txt"
fi
echo ""

# Vérifier les conflits potentiels
echo -e "${BLUE}🔎 Vérification des conflits...${NC}"

# Vérifier si pytest est dans requirements.txt (ne devrait pas)
if grep -q "^pytest" backend/app/requirements.txt; then
    echo -e "${YELLOW}⚠️  pytest trouvé dans requirements.txt (devrait être dans requirements-dev.txt)${NC}"
fi

# Vérifier si black est dans requirements.txt (ne devrait pas)
if grep -q "^black" backend/app/requirements.txt; then
    echo -e "${YELLOW}⚠️  black trouvé dans requirements.txt (devrait être dans requirements-dev.txt)${NC}"
fi

# Vérifier si flake8 est dans requirements.txt (ne devrait pas)
if grep -q "^flake8" backend/app/requirements.txt; then
    echo -e "${YELLOW}⚠️  flake8 trouvé dans requirements.txt (devrait être dans requirements-dev.txt)${NC}"
fi

# Tester la résolution des dépendances
echo -e "\n${BLUE}🧪 Test de résolution des dépendances...${NC}"

cd backend/app

# Test avec requirements.txt uniquement
echo -e "${GREEN}Test 1: requirements.txt${NC}"
if pip install --dry-run -r requirements.txt &> /tmp/pip_test_base.txt; then
    echo -e "${GREEN}✅ requirements.txt: OK${NC}"
else
    echo -e "${RED}❌ requirements.txt: Conflits détectés${NC}"
    cat /tmp/pip_test_base.txt | tail -20
fi

# Test avec requirements-dev.txt si disponible
if [ -f "requirements-dev.txt" ]; then
    echo -e "\n${GREEN}Test 2: requirements-dev.txt${NC}"
    if pip install --dry-run -r requirements-dev.txt &> /tmp/pip_test_dev.txt; then
        echo -e "${GREEN}✅ requirements-dev.txt: OK${NC}"
    else
        echo -e "${RED}❌ requirements-dev.txt: Conflits détectés${NC}"
        cat /tmp/pip_test_dev.txt | tail -20
    fi
fi

cd ..

echo -e "\n${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Vérification terminée${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

echo -e "Pour installer les dépendances:"
echo -e "  ${BLUE}cd backend/app && pip install -r requirements.txt${NC}"
echo -e "  ${BLUE}cd backend/app && pip install -r requirements-dev.txt${NC}\n"
