# Alertmanager Configuration Changelog

## Version 2.0.0 - Enhanced Configuration

### Added
- Hierarchical routing based on alert severity (critical, warning, info)
- Multiple specialized receivers for different alert types
- Inhibition rules to reduce alert noise
- Service-specific routing for backend alerts
- Enhanced Slack message formatting with rich templates
- HTML email templates for better readability
- Webhook support for external integrations
- PagerDuty integration support (optional)
- Environment variable support for secure configuration
- Comprehensive documentation

### Improved
- Better alert grouping to reduce notification spam
- Optimized timing intervals for different alert severities
- Enhanced message formatting with emojis and structured data
- Separate channels for different alert types
- On-call specific routing for critical alerts

### Changed
- Default receiver now uses environment variables
- Email configuration moved to environment variables
- Slack webhook URL now uses environment variables
- All sensitive data now uses environment variables

### Removed
- Hardcoded credentials and URLs
- Single default receiver approach

## Migration Guide

### From Version 1.0 to 2.0

1. **Set Environment Variables**:
   ```bash
   export SLACK_WEBHOOK_URL="your-slack-webhook-url"
   export ALERT_EMAIL_TO="your-email@domain.com"
   # ... other variables
   ```

2. **Update Docker Compose**:
   The docker-compose file has been updated to support environment variables. Make sure to set them before starting.

3. **Update Alert Labels**:
   Ensure your Prometheus alerts use the correct labels:
   - `severity: critical|warning|info`
   - `service: github-ai-search-backend` (or your service name)

4. **Test Configuration**:
   ```bash
   docker exec alertmanager amtool check-config /etc/alertmanager/alertmanager.yml
   ```

## Breaking Changes

- Environment variables are now required for Slack and Email configurations
- Alert routing now depends on `severity` label being set correctly
- Default receiver behavior changed - now routes based on severity

