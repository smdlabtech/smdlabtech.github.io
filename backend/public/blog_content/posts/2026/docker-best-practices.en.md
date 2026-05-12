---
title: Docker best practices for Python applications
date: 2024-11-15
author: Daya SYLLA
category: DevOps
tags: [Docker, Python, Containers, CI/CD, Best Practices]
---

# Docker best practices for Python applications

Docker is central to development and deployment. Here are solid practices for containerizing Python apps.

## Dockerfile structure

### 1. Multi-stage builds

```dockerfile
# Stage 1: Builder
FROM python:3.10-slim as builder
WORKDIR /build
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage 2: Production
FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

**Benefits:**
- Smaller final image
- Better security (no build tools in prod)
- Faster rebuilds when only app code changes

### 2. Prefer slim images

❌ **Avoid:**
```dockerfile
FROM python:3.10  # ~900 MB
```

✅ **Prefer:**
```dockerfile
FROM python:3.10-slim  # ~120 MB
```

### 3. Layer cache optimization

```dockerfile
# Copy requirements first (changes less often)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code last (changes more often)
COPY . .
```

## Security

### 1. Non-root user

```dockerfile
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
```

### 2. Do not bake in secrets

❌ **Bad:**
```dockerfile
ENV API_KEY=secret123
```

✅ **Good:**
```dockerfile
# Use Docker secrets or runtime environment variables
# docker run -e API_KEY=secret123
```

### 3. Scan for vulnerabilities

```bash
trivy image myapp:latest
```

## Performance

### 1. .dockerignore

```dockerignore
__pycache__
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.git/
.gitignore
README.md
```

### 2. Health checks

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:8080/health || exit 1
```

### 3. Labels for metadata

```dockerfile
LABEL maintainer="Daya SYLLA <dev@example.com>"
LABEL version="1.0"
LABEL description="Flask Portfolio Application"
```

## Docker Compose

### Example service

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      - FLASK_ENV=production
    volumes:
      - ./app:/app
    ports:
      - "8080:8080"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## CI/CD integration

### GitHub Actions

```yaml
name: Build and Push
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build image
        run: docker build -t myapp:${{ github.sha }} .
      - name: Push to registry
        run: docker push myapp:${{ github.sha }}
```

## Monitoring

### Structured logs

```python
import logging
import json

logging.basicConfig(
    format='%(asctime)s %(levelname)s %(message)s',
    level=logging.INFO
)
```

### Metrics

- Expose Prometheus metrics
- Add a `/metrics` endpoint
- Visualize with Grafana

## Conclusion

These practices help you build Docker images that are lean, secure, and easy to operate—improving both development and deployment workflows.
