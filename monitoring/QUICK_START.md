# 🚀 Quick Start: Prometheus Scraping

## One-Command Setup

```bash
# Start the observability stack
docker compose -f docker-compose.observability.yml up -d

# Verify setup
./monitoring/scripts/verify-prometheus-setup.sh
```

## Manual Verification

### 1. Check Backend Metrics
```bash
curl http://localhost:8080/api/metrics/prometheus
```

### 2. Check Prometheus Targets
1. Open http://localhost:9090
2. Go to **Status → Targets**
3. Verify `github-ai-search-backend` is **UP**

### 3. Query Metrics
In Prometheus UI (http://localhost:9090/graph):
```promql
github_ai_search_requests_total
github_ai_search_success_rate
github_ai_search_health_score
```

## Configuration Files

- **Prometheus Config**: `monitoring/prometheus/prometheus.yml`
- **Alert Rules**: `monitoring/prometheus/alerts.yml`
- **Docker Compose**: `docker-compose.observability.yml`

## Troubleshooting

See [SETUP_PROMETHEUS.md](SETUP_PROMETHEUS.md) for detailed troubleshooting.

## Documentation

- [Full Setup Guide](SETUP_PROMETHEUS.md)
- [Prometheus README](monitoring/prometheus/README.md)
- [Ports Reference](PORTS.md)
