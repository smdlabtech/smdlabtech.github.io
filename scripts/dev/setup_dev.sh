#!/bin/bash
# Script de setup pour l'environnement de développement
# Usage: ./scripts/setup_dev.sh

set -e

# Couleurs pour l'output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Configuration de l'environnement de développement...${NC}\n"

# Vérifier Python
echo -e "${GREEN}📦 Vérification de Python...${NC}"
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}⚠️  Python 3 n'est pas installé${NC}"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo -e "✅ $PYTHON_VERSION\n"

# Créer un environnement virtuel
echo -e "${GREEN}🔧 Création de l'environnement virtuel...${NC}"
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo -e "✅ Environnement virtuel créé\n"
else
    echo -e "✅ Environnement virtuel existe déjà\n"
fi

# Activer l'environnement virtuel
echo -e "${GREEN}🔌 Activation de l'environnement virtuel...${NC}"
source venv/bin/activate
echo -e "✅ Environnement activé\n"

# Mettre à jour pip
echo -e "${GREEN}📥 Mise à jour de pip...${NC}"
pip install --upgrade pip setuptools wheel
echo -e "✅ pip mis à jour\n"

# Installer les dépendances
echo -e "${GREEN}📚 Installation des dépendances...${NC}"
cd app
pip install -r requirements.txt
echo -e "✅ Dépendances installées\n"

# Installer pre-commit hooks
echo -e "${GREEN}🪝 Installation des pre-commit hooks...${NC}"
if command -v pre-commit &> /dev/null; then
    cd ..
    pre-commit install
    echo -e "✅ Pre-commit hooks installés\n"
else
    echo -e "${YELLOW}⚠️  pre-commit n'est pas installé. Installation...${NC}"
    pip install pre-commit
    pre-commit install
    echo -e "✅ Pre-commit hooks installés\n"
fi

# Créer les fichiers .env si ils n'existent pas
echo -e "${GREEN}📝 Configuration des variables d'environnement...${NC}"
cd ..
if [ ! -f ".env" ]; then
    if [ -f "env.example" ]; then
        cp env.example .env
        echo -e "✅ Fichier .env créé depuis env.example\n"
    else
        echo -e "${YELLOW}⚠️  Fichier env.example non trouvé${NC}\n"
    fi
    echo -e "${YELLOW}⚠️  N'oubliez pas de modifier .env avec vos valeurs !${NC}\n"
else
    echo -e "✅ Fichier .env existe déjà\n"
fi

# Initialiser la base de données
echo -e "${GREEN}🗄️  Initialisation de la base de données...${NC}"
if [ -f "scripts/setup_db.py" ]; then
    python scripts/setup_db.py
    echo -e "✅ Base de données initialisée\n"
else
    echo -e "${YELLOW}⚠️  Script setup_db.py non trouvé${NC}\n"
fi

# Créer les dossiers nécessaires
echo -e "${GREEN}📁 Création des dossiers nécessaires...${NC}"
mkdir -p instance
mkdir -p app/src/public/uploads
mkdir -p app/src/public/blog_content
mkdir -p logs
echo -e "✅ Dossiers créés\n"

# Résumé
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Configuration terminée avec succès !${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"
echo -e "Prochaines étapes :"
echo -e "1. Modifier le fichier .env avec vos valeurs"
echo -e "2. Lancer l'application : ${BLUE}cd app && python run.py${NC}"
echo -e "3. Exécuter les tests : ${BLUE}./scripts/run_tests.sh${NC}"
echo -e "4. Lancer avec Docker : ${BLUE}docker-compose up -d${NC}\n"
