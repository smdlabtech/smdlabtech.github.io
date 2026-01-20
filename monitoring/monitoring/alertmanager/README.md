# Alertmanager Configuration

Enhanced Alertmanager configuration with hierarchical routing, multiple receivers, and best practices for production use.

## Features

- **Hierarchical Routing**: Routes alerts based on severity (critical, warning, info)
- **Multiple Receivers**: Separate channels for different alert types
- **Inhibition Rules**: Suppress lower-priority alerts when critical ones are firing
- **Service-Specific Routes**: Custom routing for different services
- **Multiple Notification Channels**: Slack, Email, Webhooks, PagerDuty support
- **Custom Templates**: Rich formatting for alert messages
- **Environment Variables**: Secure configuration using environment variables

## Configuration

### Environment Variables

Set these environment variables before starting Alertmanager:

```bash
# Slack Configuration
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Email Configuration (SMTP)
export SMTP_HOST="smtp.gmail.com"
export SMTP_PORT="587"
export SMTP_USER="your-email@gmail.com"
export SMTP_PASSWORD="your-app-password"
export ALERT_EMAIL_FROM="alerts@yourdomain.com"
export ALERT_EMAIL_TO="team@yourdomain.com"
export ALERT_EMAIL_CRITICAL="oncall@yourdomain.com"
export ALERT_EMAIL_WARNING="devops@yourdomain.com"
export ALERT_EMAIL_ERRORS="backend-team@yourdomain.com"
export ONCALL_EMAIL="oncall@yourdomain.com"
export BACKEND_TEAM_EMAIL="backend@yourdomain.com"

# Webhook Configuration (optional)
export WEBHOOK_URL="https://your-webhook-url.com/alerts"
export WEBHOOK_BEARER_TOKEN="your-bearer-token"

# PagerDuty Configuration (optional)
export PAGERDUTY_SERVICE_KEY="your-pagerduty-service-key"
```

### Using Docker Compose

Update `docker-compose.observability.yml` to include environment variables:

```yaml
alertmanager:
  image: prom/alertmanager:latest
  container_name: alertmanager
  environment:
    - SLACK_WEBHOOK_URL=${SLACK_WEBHOOK_URL}
    - ALERT_EMAIL_TO=${ALERT_EMAIL_TO}
    # ... other variables
  volumes:
    - ./monitoring/alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
  command:
    - --config.file=/etc/alertmanager/alertmanager.yml
  ports:
    - "9093:9093"
```

## Alert Routing

### Critical Alerts
- **Route**: `severity: critical`
- **Receivers**: `critical-alerts`, `critical-oncall` (for BackendDown)
- **Timing**: Immediate notification (10s wait, 2m interval, 1h repeat)
- **Channels**: 
  - Slack: `#alerts-critical`, `#oncall-critical`
  - Email: Critical team email
  - Webhook: External systems

### Warning Alerts
- **Route**: `severity: warning`
- **Receiver**: `warning-alerts`
- **Timing**: 1m wait, 10m interval, 6h repeat
- **Channels**: 
  - Slack: `#alerts-warning`
  - Email: DevOps team

### Info Alerts
- **Route**: `severity: info`
- **Receiver**: `info-alerts`
- **Timing**: 5m wait, 30m interval, 24h repeat
- **Channels**: 
  - Slack: `#alerts-info` (no resolved notifications)

### Service-Specific Routes
- **Backend Service**: Routes to `backend-team` receiver
- **High Error Rate**: Special handling with `error-rate-alerts` receiver

## Inhibition Rules

The configuration includes inhibition rules to reduce alert noise:

1. **Warning suppression**: When a critical alert fires, suppress related warning alerts
2. **Info suppression**: When warning or critical alerts fire, suppress related info alerts

## Receivers

### Default Receiver
- Fallback for unmatched alerts
- Channels: `#alerts-general`, default email

### Critical Alerts Receiver
- For `severity: critical` alerts
- Channels: `#alerts-critical`, critical email, webhook

### Critical On-Call Receiver
- For highest priority alerts (e.g., BackendDown)
- Channels: `#oncall-critical`, on-call email
- Immediate notification with @here/@channel mentions

### Warning Alerts Receiver
- For `severity: warning` alerts
- Channels: `#alerts-warning`, warning email

### Info Alerts Receiver
- For `severity: info` alerts
- Channels: `#alerts-info` (no resolved notifications)

### Backend Team Receiver
- For `service: github-ai-search-backend` alerts
- Channels: `#backend-alerts`, backend team email

### Error Rate Receiver
- For `alertname: HighErrorRate` alerts
- Channels: `#alerts-errors`, error monitoring email

## Customization

### Adding New Routes

Add new routes in the `routes` section:

```yaml
routes:
  - match:
      service: your-service
    receiver: your-service-receiver
    continue: true
```

### Adding New Receivers

Add new receivers in the `receivers` section:

```yaml
receivers:
  - name: your-receiver
    slack_configs:
      - api_url: '${SLACK_WEBHOOK_URL}'
        channel: '#your-channel'
```

### Custom Templates

Create custom templates in `/etc/alertmanager/templates/` and reference them in the `templates` section.

## Testing

### Test Alert Configuration

1. Start Alertmanager:
```bash
docker-compose -f docker-compose.observability.yml up -d alertmanager
```

2. Access Alertmanager UI:
```
http://localhost:9093
```

3. Test alert routing:
```bash
# Send test alert via Prometheus
curl -X POST http://localhost:9093/api/v1/alerts -d '[{
  "labels": {
    "alertname": "TestAlert",
    "severity": "critical",
    "service": "github-ai-search-backend"
  },
  "annotations": {
    "summary": "Test alert",
    "description": "This is a test alert"
  }
}]'
```

### Validate Configuration

```bash
# Check configuration syntax
docker exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml

# Test routing
docker exec alertmanager amtool config routes show
```

## Best Practices

1. **Use Environment Variables**: Never hardcode sensitive information
2. **Group Related Alerts**: Use `group_by` to reduce notification noise
3. **Set Appropriate Intervals**: Balance between alerting speed and noise reduction
4. **Use Inhibition Rules**: Suppress lower-priority alerts when critical ones fire
5. **Monitor Alertmanager**: Set up alerts for Alertmanager itself
6. **Document Routes**: Keep documentation updated when adding new routes
7. **Test Changes**: Always test configuration changes in staging first

## Troubleshooting

### Alerts Not Being Sent

1. Check Alertmanager logs:
```bash
docker logs alertmanager
```

2. Verify configuration:
```bash
docker exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
```

3. Check Prometheus is sending alerts:
```bash
# In Prometheus UI: Status -> Targets -> Alertmanagers
```

### Too Many Notifications

- Increase `group_interval` and `repeat_interval`
- Add more specific routes to reduce grouping
- Use inhibition rules more aggressively

### Missing Notifications

- Decrease `group_wait` and `group_interval`
- Check receiver configurations
- Verify environment variables are set correctly

## References

- [Alertmanager Documentation](https://prometheus.io/docs/alerting/latest/alertmanager/)
- [Alertmanager Configuration](https://prometheus.io/docs/alerting/latest/configuration/)
- [Slack Integration](https://prometheus.io/docs/alerting/latest/notification_examples/#slack)
- [Email Integration](https://prometheus.io/docs/alerting/latest/notification_examples/#email)

