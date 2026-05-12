#!/bin/bash
# Script pour générer automatiquement le fichier .env
# Usage: ./scripts/generate_env.sh [development|production]

set -e

# Couleurs pour l'output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Déterminer l'environnement
ENV_TYPE=${1:-development}

echo -e "${BLUE}🔧 Génération du fichier .env pour l'environnement: ${ENV_TYPE}${NC}\n"

# Vérifier que le fichier source existe
if [ "$ENV_TYPE" = "production" ]; then
    SOURCE_FILE="env.production.example"
else
    SOURCE_FILE="env.example"
fi

if [ ! -f "$SOURCE_FILE" ]; then
    echo -e "${RED}❌ Erreur: Le fichier $SOURCE_FILE n'existe pas${NC}"
    exit 1
fi

# Vérifier si .env existe déjà
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Le fichier .env existe déjà${NC}"
    read -p "Voulez-vous le remplacer? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Annulé${NC}"
        exit 0
    fi
    echo -e "${YELLOW}Suppression de l'ancien fichier .env...${NC}"
    rm .env
fi

# Copier le fichier source
echo -e "${GREEN}📋 Copie de $SOURCE_FILE vers .env...${NC}"
cp "$SOURCE_FILE" .env

# Fonction pour générer une clé secrète sécurisée
generate_secret_key() {
    python3 -c "import secrets; print(secrets.token_hex(32))" 2>/dev/null || \
    openssl rand -hex 32 2>/dev/null || \
    echo "dev-secret-key-$(date +%s | sha256sum | base64 | head -c 32)"
}

# Générer les clés secrètes si elles sont encore aux valeurs par défaut
echo -e "${GREEN}🔐 Génération des clés secrètes...${NC}"

# Générer SECRET_KEY
if grep -q "dev-secret-key-change-in-production-please" .env || \
   grep -q "CHANGE-THIS-TO-A-SECURE-RANDOM-STRING" .env; then
    SECRET_KEY=$(generate_secret_key)

    # Remplacer SECRET_KEY (macOS et Linux compatible)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|" .env
        sed -i '' "s|JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$SECRET_KEY|" .env
    else
        # Linux
        sed -i "s|SECRET_KEY=.*|SECRET_KEY=$SECRET_KEY|" .env
        sed -i "s|JWT_SECRET_KEY=.*|JWT_SECRET_KEY=$SECRET_KEY|" .env
    fi

    echo -e "✅ SECRET_KEY générée automatiquement"
    echo -e "✅ JWT_SECRET_KEY générée automatiquement"
else
    echo -e "${YELLOW}⚠️  Les clés secrètes semblent déjà configurées${NC}"
fi

# Demander des valeurs personnalisées pour la production
if [ "$ENV_TYPE" = "production" ]; then
    echo -e "\n${BLUE}📝 Configuration de la production${NC}"
    echo -e "${YELLOW}Veuillez configurer les valeurs suivantes manuellement dans .env:${NC}"
    echo -e "  - DATABASE_URL (PostgreSQL)"
    echo -e "  - REDIS_URL"
    echo -e "  - CORS_ORIGINS (vos domaines autorisés)"
    echo -e "  - GCP_PROJECT_ID (si utilisé)"
    echo -e "  - GCP_REGION (si utilisé)"
fi

# Créer le dossier instance s'il n'existe pas
if [ ! -d "instance" ]; then
    echo -e "\n${GREEN}📁 Création du dossier instance...${NC}"
    mkdir -p instance
    echo -e "✅ Dossier instance créé"
fi

# Résumé
echo -e "\n${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Fichier .env généré avec succès !${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}\n"

echo -e "Fichier créé: ${BLUE}.env${NC}"
echo -e "Environnement: ${BLUE}${ENV_TYPE}${NC}\n"

if [ "$ENV_TYPE" = "development" ]; then
    echo -e "${YELLOW}💡 Conseils:${NC}"
    echo -e "  - Les clés secrètes ont été générées automatiquement"
    echo -e "  - Vous pouvez modifier .env selon vos besoins"
    echo -e "  - Pour la production, utilisez: ${BLUE}./scripts/generate_env.sh production${NC}\n"
else
    echo -e "${RED}⚠️  IMPORTANT pour la production:${NC}"
    echo -e "  - Vérifiez toutes les valeurs dans .env"
    echo -e "  - Assurez-vous que les clés secrètes sont sécurisées"
    echo -e "  - Ne commitez JAMAIS le fichier .env\n"
fi

echo -e "Prochaines étapes:"
echo -e "  1. Vérifier le fichier .env"
echo -e "  2. Modifier les valeurs si nécessaire"
echo -e "  3. Lancer l'application: ${BLUE}cd app && python run.py${NC}\n"
