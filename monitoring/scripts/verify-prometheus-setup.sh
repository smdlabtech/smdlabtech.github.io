#!/bin/bash
# Script to verify Prometheus scraping configuration
# This script checks if Prometheus can successfully scrape metrics from the backend

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Verifying Prometheus Setup${NC}"
echo ""

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
PROMETHEUS_URL="${PROMETHEUS_URL:-http://localhost:9090}"
METRICS_ENDPOINT="${METRICS_ENDPOINT:-/api/metrics/prometheus}"

# Function to check if a service is accessible
check_service() {
    local service_name=$1
    local url=$2
    local description=$3
    
    echo -e "${BLUE}Checking ${description}...${NC}"
    
    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$url" 2>/dev/null || echo "000")
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ ${service_name} is accessible (HTTP ${HTTP_CODE})${NC}"
            return 0
        elif [ "$HTTP_CODE" = "000" ]; then
            echo -e "${RED}❌ ${service_name} is not accessible (connection failed)${NC}"
            return 1
        else
            echo -e "${YELLOW}⚠️  ${service_name} returned HTTP ${HTTP_CODE}${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  curl not available, skipping ${description}${NC}"
        return 2
    fi
}

# Function to check Docker containers
check_docker_container() {
    local container_name=$1
    
    if command -v docker &> /dev/null; then
        if docker ps --format '{{.Names}}' | grep -q "^${container_name}$"; then
            echo -e "${GREEN}✅ Container '${container_name}' is running${NC}"
            return 0
        else
            echo -e "${RED}❌ Container '${container_name}' is not running${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}⚠️  docker not available, skipping container check${NC}"
        return 2
    fi
}

# Step 1: Check Docker containers
echo -e "${BLUE}📦 Step 1: Checking Docker Containers${NC}"
echo ""

check_docker_container "backend"
BACKEND_CONTAINER=$?

check_docker_container "prometheus"
PROMETHEUS_CONTAINER=$?

echo ""

# Step 2: Check backend metrics endpoint
echo -e "${BLUE}📊 Step 2: Checking Backend Metrics Endpoint${NC}"
echo ""

BACKEND_METRICS_URL="${BACKEND_URL}${METRICS_ENDPOINT}"
check_service "Backend Metrics" "$BACKEND_METRICS_URL" "backend metrics endpoint"

if [ $? -eq 0 ]; then
    echo -e "${BLUE}Verifying metrics format...${NC}"
    METRICS_OUTPUT=$(curl -s --max-time 5 "$BACKEND_METRICS_URL" 2>/dev/null || echo "")
    
    if echo "$METRICS_OUTPUT" | grep -q "# HELP"; then
        echo -e "${GREEN}✅ Metrics are in Prometheus format${NC}"
        
        # Count metrics
        METRIC_COUNT=$(echo "$METRICS_OUTPUT" | grep -c "^github_ai_search_" || echo "0")
        echo -e "${BLUE}   Found ${METRIC_COUNT} metrics${NC}"
    else
        echo -e "${YELLOW}⚠️  Metrics may not be in Prometheus format${NC}"
    fi
fi

echo ""

# Step 3: Check Prometheus
echo -e "${BLUE}🔍 Step 3: Checking Prometheus${NC}"
echo ""

check_service "Prometheus" "$PROMETHEUS_URL" "Prometheus UI"

if [ $? -eq 0 ]; then
    # Check Prometheus targets API
    TARGETS_URL="${PROMETHEUS_URL}/api/v1/targets"
    echo -e "${BLUE}Checking Prometheus targets...${NC}"
    
    TARGETS_JSON=$(curl -s --max-time 5 "$TARGETS_URL" 2>/dev/null || echo "{}")
    
    if echo "$TARGETS_JSON" | grep -q "github-ai-search-backend"; then
        echo -e "${GREEN}✅ Target 'github-ai-search-backend' found in Prometheus${NC}"
        
        # Check target status
        if echo "$TARGETS_JSON" | grep -q '"health":"up"'; then
            echo -e "${GREEN}✅ Target is UP${NC}"
        elif echo "$TARGETS_JSON" | grep -q '"health":"down"'; then
            echo -e "${RED}❌ Target is DOWN${NC}"
            echo -e "${YELLOW}   Check Prometheus logs: docker logs prometheus${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Target 'github-ai-search-backend' not found${NC}"
        echo -e "${YELLOW}   Verify prometheus.yml configuration${NC}"
    fi
fi

echo ""

# Step 4: Check Prometheus configuration
echo -e "${BLUE}⚙️  Step 4: Checking Prometheus Configuration${NC}"
echo ""

if [ "$PROMETHEUS_CONTAINER" -eq 0 ]; then
    echo -e "${BLUE}Validating Prometheus configuration...${NC}"
    
    if docker exec prometheus promtool check config /etc/prometheus/prometheus.yml 2>&1 | grep -q "SUCCESS"; then
        echo -e "${GREEN}✅ Prometheus configuration is valid${NC}"
    else
        echo -e "${RED}❌ Prometheus configuration has errors${NC}"
        echo -e "${YELLOW}   Run: docker exec prometheus promtool check config /etc/prometheus/prometheus.yml${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Prometheus container not running, skipping config check${NC}"
fi

echo ""

# Step 5: Test connectivity from Prometheus to Backend
echo -e "${BLUE}🌐 Step 5: Testing Docker Network Connectivity${NC}"
echo ""

if [ "$PROMETHEUS_CONTAINER" -eq 0 ] && [ "$BACKEND_CONTAINER" -eq 0 ]; then
    echo -e "${BLUE}Testing connection from Prometheus to Backend...${NC}"
    
    TEST_RESULT=$(docker exec prometheus wget -qO- --timeout=5 http://backend:8080/api/metrics/prometheus 2>&1 || echo "ERROR")
    
    if echo "$TEST_RESULT" | grep -q "# HELP"; then
        echo -e "${GREEN}✅ Prometheus can reach backend metrics endpoint${NC}"
    elif echo "$TEST_RESULT" | grep -q "ERROR"; then
        echo -e "${RED}❌ Prometheus cannot reach backend${NC}"
        echo -e "${YELLOW}   Check Docker network configuration${NC}"
    else
        echo -e "${YELLOW}⚠️  Unexpected response from backend${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Containers not running, skipping network test${NC}"
fi

echo ""

# Summary
echo -e "${BLUE}📋 Summary${NC}"
echo ""
echo -e "Backend Metrics URL: ${BACKEND_METRICS_URL}"
echo -e "Prometheus UI: ${PROMETHEUS_URL}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Open Prometheus UI: ${PROMETHEUS_URL}"
echo "2. Go to Status → Targets to verify target status"
echo "3. Go to Graph to query metrics: github_ai_search_requests_total"
echo "4. Check alerts: Status → Rules"
echo ""

