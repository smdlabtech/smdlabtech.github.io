#!/bin/bash
# Script pour tester les endpoints Jekyll
# Usage: ./scripts/test_jekyll_endpoints.sh

set -e

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

BASE_URL="http://localhost:4000"

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║     🧪 Test des Endpoints Jekyll                     ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

# Vérifier que le serveur est en cours d'exécution
echo -e "${GREEN}🔍 Vérification du serveur Jekyll...${NC}"
if ! curl -s -f "${BASE_URL}" > /dev/null 2>&1; then
    echo -e "${RED}❌ Le serveur Jekyll n'est pas accessible sur ${BASE_URL}${NC}"
    echo -e "${YELLOW}💡 Assurez-vous que Jekyll est lancé:${NC}"
    echo -e "   ${BLUE}./scripts/launch_jekyll.sh${NC}\n"
    exit 1
fi
echo -e "✅ Serveur Jekyll accessible\n"

# Fonction pour tester un endpoint
test_endpoint() {
    local url=$1
    local name=$2
    local expected_status=${3:-200}

    echo -e "${GREEN}Test: ${name}${NC}"
    echo -e "  URL: ${BLUE}${url}${NC}"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${url}" || echo "000")

    if [ "$HTTP_CODE" = "$expected_status" ]; then
        echo -e "  ${GREEN}✅ Status: ${HTTP_CODE}${NC}\n"
        return 0
    else
        echo -e "  ${RED}❌ Status: ${HTTP_CODE} (attendu: ${expected_status})${NC}\n"
        return 1
    fi
}

# Tests
ERRORS=0

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Test 1: Page d'accueil
test_endpoint "${BASE_URL}/" "Page d'accueil" || ERRORS=$((ERRORS + 1))

# Test 2: Page About
test_endpoint "${BASE_URL}/about/" "Page About" || ERRORS=$((ERRORS + 1))

# Test 3: Page Tags
test_endpoint "${BASE_URL}/tags/" "Page Tags" || ERRORS=$((ERRORS + 1))

# Test 4: Page Explore
test_endpoint "${BASE_URL}/explore/" "Page Explore" || ERRORS=$((ERRORS + 1))

# Test 5: Feed RSS
test_endpoint "${BASE_URL}/feed.xml" "Feed RSS" || ERRORS=$((ERRORS + 1))

# Test 6: Page Projects (peut être .html ou /)
if curl -s -f "${BASE_URL}/projects.html" > /dev/null 2>&1; then
    test_endpoint "${BASE_URL}/projects.html" "Page Projects" || ERRORS=$((ERRORS + 1))
elif curl -s -f "${BASE_URL}/projects/" > /dev/null 2>&1; then
    test_endpoint "${BASE_URL}/projects/" "Page Projects" || ERRORS=$((ERRORS + 1))
else
    echo -e "${YELLOW}⚠️  Page Projects non trouvée (optionnel)${NC}\n"
fi

# Test 7: Page 404 (doit retourner 404)
test_endpoint "${BASE_URL}/page-inexistante-12345" "Page 404" 404 || ERRORS=$((ERRORS + 1))

# Résumé
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║     ✅ Tous les tests sont passés !                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}\n"

    echo -e "${BLUE}🌐 Pages disponibles:${NC}\n"
    echo -e "  ${BLUE}•${NC} Accueil: ${BLUE}${BASE_URL}/${NC}"
    echo -e "  ${BLUE}•${NC} À propos: ${BLUE}${BASE_URL}/about/${NC}"
    echo -e "  ${BLUE}•${NC} Tags: ${BLUE}${BASE_URL}/tags/${NC}"
    echo -e "  ${BLUE}•${NC} Explorer: ${BLUE}${BASE_URL}/explore/${NC}"
    echo -e "  ${BLUE}•${NC} Projets: ${BLUE}${BASE_URL}/projects.html${NC}"
    echo -e "  ${BLUE}•${NC} Feed RSS: ${BLUE}${BASE_URL}/feed.xml${NC}\n"

    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║     ❌ $ERRORS test(s) ont échoué                     ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════╝${NC}\n"
    exit 1
fi
