# Multi-stage build pour optimiser la taille de l'image
FROM python:3.11-slim as builder

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Installation des dépendances système
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de dépendances
COPY requirements.txt .

# Installation des dépendances Python
RUN pip install --user --no-cache-dir -r requirements.txt

# Stage de production
FROM python:3.11-slim

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH"

# Création d'un utilisateur non-root
RUN useradd -m -u 1000 appuser && \
    mkdir -p /app/instance /app/src/public/uploads /app/logs && \
    chown -R appuser:appuser /app

# Copie des dépendances depuis le builder
COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

# Définition du répertoire de travail
WORKDIR /app

# Copie du code source
COPY --chown=appuser:appuser . .

# Changement d'utilisateur
USER appuser

# Exposition du port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health', timeout=5)"

# Commande de démarrage avec Gunicorn
# Note: run.py crée l'app via create_app()
CMD ["gunicorn", "--config", "src/gunicorn_config.py", "--pythonpath", "/app", "run:app"]

