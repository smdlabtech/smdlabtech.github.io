#!/bin/bash
# Script de test rapide de l'application
# Vérifie que tout est prêt avant de lancer

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔍 Vérification rapide avant lancement...${NC}\n"

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 n'est pas installé${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python: $(python3 --version)${NC}"

# Vérifier venv
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  venv n'existe pas${NC}"
    echo -e "${YELLOW}💡 Exécutez: ./scripts/dev/setup_complete.sh${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Environnement virtuel trouvé${NC}"

# Activer venv et vérifier Flask
source venv/bin/activate
if ! python -c "import flask" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Flask non installé${NC}"
    echo -e "${YELLOW}💡 Installation des dépendances...${NC}"
    cd app
    pip install -r requirements.txt --quiet
    cd ..
    echo -e "${GREEN}✅ Dépendances installées${NC}"
else
    echo -e "${GREEN}✅ Flask installé${NC}"
fi

# Vérifier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env n'existe pas${NC}"
    if [ -f "scripts/dev/generate_env.sh" ]; then
        echo -e "${YELLOW}Génération de .env...${NC}"
        ./scripts/dev/generate_env.sh development
    fi
else
    echo -e "${GREEN}✅ Fichier .env trouvé${NC}"
fi

# Vérifier la base de données
if [ ! -f "instance/portfolio_pro.db" ]; then
    echo -e "${YELLOW}⚠️  Base de données non trouvée${NC}"
    echo -e "${YELLOW}💡 Sera créée automatiquement au lancement${NC}"
else
    echo -e "${GREEN}✅ Base de données trouvée${NC}"
fi

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Tout est prêt !${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}🚀 Pour lancer l'application:${NC}"
echo -e "   ${BLUE}./scripts/dev/launch_app.sh${NC}\n"

echo -e "${YELLOW}🧪 Pour tester l'application:${NC}"
echo -e "   ${BLUE}./scripts/quality/test_app.sh${NC}\n"
