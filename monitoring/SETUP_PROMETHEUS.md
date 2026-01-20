# 🚀 Setup Guide: Prometheus Scraping Configuration

This guide explains how to configure Prometheus to scrape metrics from the GitHub AI Search Backend.

## 📋 Overview

The backend exposes Prometheus metrics at:
```
GET /api/metrics/prometheus
```

Prometheus is configured to scrape this endpoint every 15 seconds.

## ✅ Quick Setup

### 1. Verify Backend Metrics Endpoint

```bash
# Test the metrics endpoint
curl http://localhost:8080/api/metrics/prometheus

# Expected output: Prometheus text format with metrics
# Example:
# # HELP github_ai_search_requests_total Total number of requests
# # TYPE github_ai_search_requests_total counter
# github_ai_search_requests_total 42
```

### 2. Start the Observability Stack

```bash
# Start all services (Prometheus, Grafana, Alertmanager, Loki)
docker compose -f docker-compose.observability.yml up -d

# Verify services are running
docker compose -f docker-compose.observability.yml ps
```

### 3. Verify Prometheus Configuration

```bash
# Check configuration syntax
docker exec prometheus promtool check config /etc/prometheus/prometheus.yml

# Expected output:
# Checking /etc/prometheus/prometheus.yml
# SUCCESS: 1 rule files found
```

### 4. Check Prometheus Targets

1. Open Prometheus UI: http://localhost:9090
2. Navigate to **Status → Targets**
3. Verify `github-ai-search-backend` target shows:
   - **State**: UP (green)
   - **Last Scrape**: Recent timestamp
   - **Scrape Duration**: < 1s

## 🔍 Configuration Details

### Prometheus Configuration (`monitoring/prometheus/prometheus.yml`)

```yaml
scrape_configs:
  - job_name: "github-ai-search-backend"
    metrics_path: /api/metrics/prometheus
    static_configs:
      - targets: ["backend:8080"]
```

**Key Points:**
- `metrics_path`: `/api/metrics/prometheus` (not `/metrics`)
- `targets`: `backend:8080` (Docker service name and port)
- `scrape_interval`: 15 seconds

### Docker Network Configuration

The backend and Prometheus must be on the same Docker network:

```yaml
# docker-compose.observability.yml
services:
  backend:
    # ... backend config ...
  
  prometheus:
    depends_on:
      - backend
    # ... prometheus config ...
```

## 📊 Available Metrics

Once Prometheus is scraping, you can query these metrics:

### Request Metrics
```promql
# Total requests
github_ai_search_requests_total

# Success rate (percentage)
github_ai_search_success_rate

# Average response time (milliseconds)
github_ai_search_avg_response_time_ms
```

### Health Metrics
```promql
# Health score (0-100)
github_ai_search_health_score

# Performance grade
github_ai_search_performance_grade
```

### Cache Metrics
```promql
# Cache usage percentage
github_ai_search_cache_usage_percent

# Cache size
github_ai_search_cache_size
```

## 🚨 Alerting Rules

The configuration includes several alerting rules (see `monitoring/prometheus/alerts.yml`):

- **BackendDown** - Backend is not responding
- **HighErrorRate** - Success rate < 95%
- **CriticalErrorRate** - Success rate < 80%
- **HighResponseTime** - Response time > 2000ms
- **LowHealthScore** - Health score < 70

## 🔧 Troubleshooting

### Problem: Target is DOWN

**Symptoms:**
- Prometheus shows target as DOWN
- No metrics available

**Solutions:**

1. **Check backend is running:**
   ```bash
   docker ps | grep backend
   curl http://localhost:8080/api/health
   ```

2. **Check metrics endpoint:**
   ```bash
   curl http://localhost:8080/api/metrics/prometheus
   ```

3. **Check Docker network:**
   ```bash
   # Find network name
   docker inspect backend | grep NetworkMode
   
   # Check if Prometheus is on same network
   docker inspect prometheus | grep NetworkMode
   ```

4. **Check Prometheus logs:**
   ```bash
   docker logs prometheus | tail -50
   ```

5. **Test connectivity from Prometheus:**
   ```bash
   docker exec prometheus wget -qO- http://backend:8080/api/metrics/prometheus
   ```

### Problem: Wrong Metrics Path

**Symptoms:**
- Target is UP but no metrics
- 404 errors in Prometheus logs

**Solution:**
- Verify `metrics_path` in `prometheus.yml` is `/api/metrics/prometheus`
- Not `/metrics` or `/api/metrics`

### Problem: Port Mismatch

**Symptoms:**
- Connection refused errors
- Target shows connection error

**Solution:**
- Verify backend port in `prometheus.yml` matches actual port (8080)
- Check `docker-compose.observability.yml` port mapping

### Problem: Metrics Format Issues

**Symptoms:**
- Metrics appear but are malformed
- Parsing errors in Prometheus

**Solution:**
- Verify endpoint returns Prometheus text format:
  ```bash
  curl http://localhost:8080/api/metrics/prometheus | head -10
  ```
- Should see `# HELP` and `# TYPE` comments

## 📈 Next Steps

### 1. Create Grafana Dashboards

1. Open Grafana: http://localhost:3030
2. Go to **Dashboards → New Dashboard**
3. Add panels using Prometheus queries
4. Example queries:
   - `rate(github_ai_search_requests_total[5m])`
   - `github_ai_search_success_rate`
   - `github_ai_search_avg_response_time_ms`

### 2. Configure Alertmanager

1. Set up Slack/Email webhooks (see `monitoring/alertmanager/README.md`)
2. Test alerts by triggering conditions
3. Verify notifications are received

### 3. Monitor Key Metrics

Set up dashboards for:
- Request rate and success rate
- Response times
- Error rates
- Cache performance
- Health score trends

## 📚 Additional Resources

- [Prometheus Configuration Documentation](monitoring/prometheus/README.md)
- [Alertmanager Configuration](monitoring/alertmanager/README.md)
- [Grafana Setup Guide](monitoring/README.md)
- [Backend Metrics API](../../backend/README_BACKEND.md)

## ✅ Verification Checklist

- [ ] Backend metrics endpoint accessible: `curl http://localhost:8080/api/metrics/prometheus`
- [ ] Prometheus configuration syntax valid: `promtool check config`
- [ ] Prometheus target shows UP in UI
- [ ] Metrics appear in Prometheus queries
- [ ] Alert rules loaded without errors
- [ ] Grafana can query Prometheus data source
- [ ] Alerts trigger correctly (test with manual conditions)

## 🆘 Getting Help

If you encounter issues:

1. Check logs: `docker logs prometheus` and `docker logs backend`
2. Verify configuration files match this guide
3. Test connectivity between services
4. Check Prometheus UI for detailed error messages
5. Review [Troubleshooting section](#-troubleshooting) above

