# Prometheus Configuration

This directory contains the Prometheus configuration for monitoring the GitHub AI Search Backend.

## Files

- `prometheus.yml` - Main Prometheus configuration file
- `alerts.yml` - Alerting rules for the backend
- `README.md` - This file

## Configuration Overview

### Scrape Configuration

Prometheus is configured to scrape metrics from the backend at:
- **Endpoint**: `http://backend:8080/api/metrics/prometheus`
- **Job Name**: `github-ai-search-backend`
- **Scrape Interval**: 15 seconds
- **Scrape Timeout**: 10 seconds

### Metrics Endpoint

The backend exposes Prometheus metrics at:
```
GET /api/metrics/prometheus
```

This endpoint returns metrics in Prometheus text format (`text/plain`).

### Available Metrics

The backend exposes the following Prometheus metrics:

#### Request Metrics
- `github_ai_search_requests_total` (counter) - Total number of requests
- `github_ai_search_requests_successful` (counter) - Total successful requests
- `github_ai_search_requests_failed` (counter) - Total failed requests
- `github_ai_search_success_rate` (gauge) - Success rate percentage
- `github_ai_search_avg_response_time_ms` (gauge) - Average response time in milliseconds

#### AI Metrics
- `github_ai_search_total_tokens_used` (counter) - Total tokens used by Gemini AI

#### Health Metrics
- `github_ai_search_health_score` (gauge) - Health score (0-100)
- `github_ai_search_performance_grade` (gauge) - Performance grade (A-F)

#### Cache Metrics
- `github_ai_search_cache_size` (gauge) - Current cache size
- `github_ai_search_cache_maxsize` (gauge) - Maximum cache size
- `github_ai_search_cache_usage_percent` (gauge) - Cache usage percentage

#### Request Type Metrics
- `github_ai_search_requests_by_type_total{type="..."}` (counter) - Requests by type
- `github_ai_search_requests_by_type_avg_time_ms{type="..."}` (gauge) - Average time by type

## Alerting Rules

The `alerts.yml` file defines several alerting rules:

1. **BackendDown** (critical) - Backend is not responding
2. **HighErrorRate** (warning) - Success rate below 95%
3. **CriticalErrorRate** (critical) - Success rate below 80%
4. **HighResponseTime** (warning) - Average response time above 2000ms
5. **LowHealthScore** (warning) - Health score below 70
6. **HighTokenUsage** (info) - High token usage rate
7. **CacheIssues** (warning) - Cache usage above 90%

## Testing the Configuration

### 1. Verify Prometheus Configuration

```bash
# Check Prometheus configuration syntax
docker exec prometheus promtool check config /etc/prometheus/prometheus.yml
```

### 2. Check Targets

1. Open Prometheus UI: http://localhost:9090
2. Navigate to **Status → Targets**
3. Verify that `github-ai-search-backend` target is **UP**

### 3. Query Metrics

In Prometheus UI (http://localhost:9090/graph), try these queries:

```promql
# Total requests
github_ai_search_requests_total

# Success rate
github_ai_search_success_rate

# Average response time
github_ai_search_avg_response_time_ms

# Health score
github_ai_search_health_score

# Cache usage
github_ai_search_cache_usage_percent
```

### 4. Test Metrics Endpoint Directly

```bash
# From host machine
curl http://localhost:8080/api/metrics/prometheus

# From within Docker network
docker exec prometheus wget -qO- http://backend:8080/api/metrics/prometheus
```

## Troubleshooting

### Target is DOWN

1. **Check backend is running:**
   ```bash
   docker ps | grep backend
   ```

2. **Check backend is accessible:**
   ```bash
   curl http://localhost:8080/api/health
   ```

3. **Check metrics endpoint:**
   ```bash
   curl http://localhost:8080/api/metrics/prometheus
   ```

4. **Check Docker network:**
   ```bash
   docker network inspect <network_name>
   ```

5. **Check Prometheus logs:**
   ```bash
   docker logs prometheus
   ```

### No Metrics Appearing

1. **Verify scrape configuration:**
   - Check `prometheus.yml` has correct `metrics_path` and `targets`
   - Ensure `metrics_path` is `/api/metrics/prometheus` (not `/metrics`)

2. **Check backend logs:**
   ```bash
   docker logs backend
   ```

3. **Verify metrics format:**
   ```bash
   curl http://localhost:8080/api/metrics/prometheus | head -20
   ```
   Should return Prometheus text format with `# HELP` and `# TYPE` comments.

### Alerts Not Firing

1. **Check alert rules are loaded:**
   - In Prometheus UI: **Status → Rules**
   - Verify rules are listed and have no errors

2. **Test alert expression:**
   - In Prometheus UI: **Graph**
   - Try the alert expression manually

3. **Check Alertmanager connection:**
   - In Prometheus UI: **Status → Targets**
   - Verify Alertmanager target is UP

## Customization

### Change Scrape Interval

Edit `prometheus.yml`:
```yaml
scrape_configs:
  - job_name: "github-ai-search-backend"
    scrape_interval: 30s  # Change from 15s to 30s
```

### Add More Targets

Add additional scrape configs:
```yaml
scrape_configs:
  - job_name: "github-ai-search-backend"
    # ... existing config ...
  
  - job_name: "another-service"
    metrics_path: /metrics
    static_configs:
      - targets: ["another-service:8080"]
```

### Modify Alert Rules

Edit `alerts.yml` to add, modify, or remove alert rules. After changes:
1. Restart Prometheus: `docker restart prometheus`
2. Verify rules: Check **Status → Rules** in Prometheus UI

## Integration with Grafana

Prometheus is automatically configured as a data source in Grafana. To use it:

1. Open Grafana: http://localhost:3030
2. Go to **Configuration → Data Sources**
3. Select **Prometheus**
4. Verify URL: `http://prometheus:9090`
5. Click **Save & Test**

You can now create dashboards using Prometheus metrics.

## References

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Prometheus Query Language (PromQL)](https://prometheus.io/docs/prometheus/latest/querying/basics/)
- [Prometheus Alerting Rules](https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/)
- [Backend Metrics API Documentation](../../../backend/README_BACKEND.md)

