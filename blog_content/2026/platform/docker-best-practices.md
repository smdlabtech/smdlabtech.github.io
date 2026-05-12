---
title: Docker Best Practices pour applications Python
date: 2024-11-15
author: Daya SYLLA
category: DevOps
tags: [Docker, Python, Containers, CI/CD, Best Practices]
---

# Docker Best Practices pour applications Python

Docker est devenu essentiel pour le développement et le déploiement. Voici les meilleures pratiques pour containeriser vos applications Python.

## Structure optimale d'un Dockerfile

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

**Avantages :**
- Image finale plus petite
- Sécurité améliorée (pas de build tools en prod)
- Builds plus rapides

### 2. Utiliser des images slim

❌ **Mauvais :**
```dockerfile
FROM python:3.10  # ~900 MB
```

✅ **Bon :**
```dockerfile
FROM python:3.10-slim  # ~120 MB
```

### 3. Optimiser le cache des layers

```dockerfile
# Copier requirements d'abord (change moins souvent)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code ensuite (change plus souvent)
COPY . .
```

## Sécurité

### 1. Utiliser un utilisateur non-root

```dockerfile
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
```

### 2. Ne pas exposer de secrets

❌ **Mauvais :**
```dockerfile
ENV API_KEY=secret123
```

✅ **Bon :**
```dockerfile
# Utiliser des secrets Docker ou variables d'environnement
# docker run -e API_KEY=secret123
```

### 3. Scanner les vulnérabilités

```bash
# Utiliser Trivy
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

### 3. Labels pour métadonnées

```dockerfile
LABEL maintainer="Daya SYLLA <dev@example.com>"
LABEL version="1.0"
LABEL description="Flask Portfolio Application"
```

## Docker Compose

### Configuration optimale

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

## CI/CD Integration

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

### Logs structurés

```python
import logging
import json

logging.basicConfig(
    format='%(asctime)s %(levelname)s %(message)s',
    level=logging.INFO
)
```

### Métriques

- Utiliser Prometheus pour les métriques
- Exposer `/metrics` endpoint
- Dashboard avec Grafana

## Conclusion

Suivez ces best practices pour créer des images Docker optimisées, sécurisées et performantes. Cela améliorera votre workflow de développement et de déploiement.
