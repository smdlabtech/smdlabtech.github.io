#!/bin/bash
# Script pour tester les endpoints de l'API
# Usage: ./scripts/test_endpoints.sh [base_url]
# Prérequis: L'application doit être lancée

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BASE_URL=${1:-http://localhost:8080}

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     🔍 Test des Endpoints API                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${GREEN}📍 Base URL: ${BLUE}${BASE_URL}${NC}\n"

# Fonction pour tester un endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=${3:-200}
    local description=$4

    echo -e "${YELLOW}Testing: ${description}${NC}"
    echo -e "  ${BLUE}${method} ${endpoint}${NC}"

    if command -v curl &> /dev/null; then
        status_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "${BASE_URL}${endpoint}")

        if [ "$status_code" -eq "$expected_status" ]; then
            echo -e "  ${GREEN}✅ Status: ${status_code} (attendu: ${expected_status})${NC}\n"
            return 0
        else
            echo -e "  ${RED}❌ Status: ${status_code} (attendu: ${expected_status})${NC}\n"
            return 1
        fi
    else
        echo -e "  ${RED}❌ curl n'est pas installé${NC}\n"
        return 1
    fi
}

# Vérifier que l'application répond
echo -e "${GREEN}🔍 Vérification de la disponibilité de l'application...${NC}"
if ! curl -s -f "${BASE_URL}/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ L'application ne répond pas sur ${BASE_URL}${NC}"
    echo -e "${YELLOW}💡 Assurez-vous que l'application est lancée:${NC}"
    echo -e "   ${BLUE}./scripts/launch_app.sh${NC}\n"
    exit 1
fi
echo -e "${GREEN}✅ Application disponible\n${NC}"

# Tests des endpoints
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🧪 Tests des Health Checks${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

test_endpoint "GET" "/health" 200 "Health check général"
test_endpoint "GET" "/health/ready" 200 "Readiness check"
test_endpoint "GET" "/health/live" 200 "Liveness check"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🧪 Tests des Routes Web${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

test_endpoint "GET" "/" 200 "Page d'accueil"
test_endpoint "GET" "/about" 200 "Page à propos"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🧪 Tests de l'API REST${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

test_endpoint "GET" "/api/v1/articles/" 200 "Liste des articles"
test_endpoint "GET" "/api/v1/projects/" 200 "Liste des projets"
test_endpoint "GET" "/api/v1/experiences/" 200 "Liste des expériences"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🧪 Tests des Métriques${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

test_endpoint "GET" "/metrics" 200 "Métriques Prometheus"

# Résumé
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Tests des endpoints terminés${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}💡 Pour tester manuellement avec curl:${NC}"
echo -e "   ${BLUE}curl ${BASE_URL}/health${NC}"
echo -e "   ${BLUE}curl ${BASE_URL}/api/v1/articles/${NC}"
echo -e "   ${BLUE}curl ${BASE_URL}/metrics${NC}\n"
