# DevOps Best Practices - Observability Stack

## Overview

This document outlines the DevOps best practices applied to the observability stack configuration.

## Architecture Principles

### 1. Containerization Best Practices

- **Health Checks**: All services include healthcheck endpoints for monitoring
- **Restart Policies**: `unless-stopped` ensures services restart automatically
- **Resource Isolation**: Dedicated network (`monitoring-network`) for service communication
- **Volume Management**: Persistent volumes for data and logs

### 2. Security Practices

#### Environment Variables
- Sensitive data (passwords, API keys) stored in environment variables
- Default values provided for development environments
- Production values should be set via `.env` files or secret management

#### Volume Security
- Configuration files mounted as read-only (`:ro`)
- Data volumes isolated per service
- Log volumes separate from data volumes

#### Network Security
- Services communicate via dedicated Docker network
- External access only through defined ports
- No unnecessary port exposure

### 3. Data Persistence

#### Volume Strategy
- **Prometheus**: `prometheus-data` - Stores time-series data (30-day retention)
- **Grafana**: `grafana-data` - Stores dashboards, users, datasources
- **Grafana Logs**: `grafana-logs` - Separate log storage
- **Alertmanager**: `alertmanager-data` - Stores alert state
- **Loki**: `loki-data` - Stores log data

#### Retention Policies
- Prometheus: 30 days (configurable via command flags)
- Loki: 7 days (168 hours) as per configuration
- Grafana: Persistent (no automatic cleanup)

### 4. Service Configuration

#### Grafana
- **Port Mapping**: `3030:3000` (host:container)
  - Port 3000 reserved for Next.js frontend
  - Port 3030 used for Grafana to avoid conflicts
- **Health Check**: `/api/health` endpoint
- **Security**: Admin credentials via environment variables
- **Data Paths**: Separate volumes for data and logs

#### Prometheus
- **Port**: `9090:9090`
- **Health Check**: `/-/healthy` endpoint
- **Storage**: Persistent volume with 30-day retention
- **External Access**: `host.docker.internal` for scraping host services

#### Alertmanager
- **Port**: `9093:9093`
- **Health Check**: `/-/healthy` endpoint
- **Storage**: Persistent volume for alert state
- **Configuration**: Simplified for local development

#### Loki
- **Port**: `3100:3100`
- **Health Check**: `/ready` endpoint
- **Storage**: Persistent volume for logs
- **WAL**: Configured to use volume path

#### Promtail
- **No External Port**: Internal service only
- **Docker Socket**: Read-only access for log collection
- **Log Paths**: Read-only access to container logs

### 5. Network Architecture

```
┌─────────────────────────────────────────┐
│      monitoring-network (bridge)        │
│                                         │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │Prometheus│  │  Loki   │  │Grafana ││
│  └──────────┘  └──────────┘  └────────┘│
│       │            │            │      │
│  ┌──────────┐  ┌──────────┐            │
│  │Alertmgr  │  │ Promtail │            │
│  └──────────┘  └──────────┘            │
└─────────────────────────────────────────┘
         │
         │ (via host.docker.internal)
         ▼
┌─────────────────────────────────────────┐
│         Host Machine                     │
│  Backend: localhost:8080                │
└─────────────────────────────────────────┘
```

### 6. Health Monitoring

All services implement health checks:

```yaml
healthcheck:
  test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider <endpoint> || exit 1"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 30s-40s
```

### 7. Port Management

| Service | Host Port | Container Port | Purpose |
|---------|-----------|----------------|---------|
| Grafana | 3030 | 3000 | Web UI (avoids conflict with Next.js) |
| Prometheus | 9090 | 9090 | Metrics collection |
| Alertmanager | 9093 | 9093 | Alert management |
| Loki | 3100 | 3100 | Log aggregation API |
| Promtail | - | - | Internal log collection |

### 8. Startup Dependencies

```yaml
depends_on:
  - prometheus  # Grafana needs Prometheus datasource
  - loki       # Grafana needs Loki datasource
```

### 9. Environment Variables

#### Required for Production
- `GRAFANA_ADMIN_USER` - Grafana admin username
- `GRAFANA_ADMIN_PASSWORD` - Grafana admin password
- `GRAFANA_LOG_LEVEL` - Logging level (info, warn, error)

#### Optional (Notification Channels)
- `SLACK_WEBHOOK_URL` - Slack integration
- `SMTP_*` - Email notifications
- `WEBHOOK_URL` - Custom webhook
- `PAGERDUTY_SERVICE_KEY` - PagerDuty integration

### 10. Maintenance Operations

#### Backup Strategy
```bash
# Backup Grafana data
docker run --rm -v monitoring_grafana-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/grafana-backup-$(date +%Y%m%d).tar.gz /data

# Backup Prometheus data
docker run --rm -v monitoring_prometheus-data:/data -v $(pwd):/backup \
  alpine tar czf /backup/prometheus-backup-$(date +%Y%m%d).tar.gz /data
```

#### Log Rotation
- Grafana logs: Managed via volume
- Prometheus: No log rotation (uses stdout)
- Loki: Configurable retention (7 days default)

#### Update Strategy
1. Stop services: `docker compose -f monitoring/docker-compose.observability.yml down`
2. Pull new images: `docker compose -f monitoring/docker-compose.observability.yml pull`
3. Start services: `docker compose -f monitoring/docker-compose.observability.yml up -d`
4. Verify health: Check health endpoints

### 11. Troubleshooting

#### Check Service Health
```bash
# All services
docker compose -f monitoring/docker-compose.observability.yml ps

# Individual service logs
docker compose -f monitoring/docker-compose.observability.yml logs <service>

# Health check manually
curl http://localhost:3030/api/health  # Grafana
curl http://localhost:9090/-/healthy   # Prometheus
curl http://localhost:9093/-/healthy  # Alertmanager
curl http://localhost:3100/ready       # Loki
```

#### Port Conflicts
```bash
# Check port usage
lsof -i :3030
lsof -i :9090
lsof -i :9093
lsof -i :3100

# Kill process on port (if needed)
kill -9 $(lsof -t -i:PORT)
```

### 12. Production Considerations

1. **Secrets Management**: Use Docker secrets or external secret managers
2. **TLS/SSL**: Configure reverse proxy (nginx/traefik) with SSL
3. **Resource Limits**: Add CPU/memory limits to services
4. **Monitoring**: Monitor the monitoring stack itself
5. **Backup Automation**: Schedule regular backups
6. **Access Control**: Implement proper authentication/authorization
7. **Network Policies**: Restrict network access in production
8. **Log Aggregation**: Centralize logs for audit purposes

## Compliance

- **Infrastructure as Code**: Docker Compose files version controlled
- **Documentation**: All configurations documented
- **Security**: Least privilege principle applied
- **Observability**: Stack monitors itself
- **Maintainability**: Modular, reusable configuration

