# Build context : racine du projet (smdlabtech.github.io/)
# docker build -f backend/Dockerfile -t portfolio-api .
FROM python:3.11-slim AS builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

COPY requirements/requirements-api.txt ./requirements-api.txt
RUN pip install --user --no-cache-dir -r requirements-api.txt

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PATH="/home/appuser/.local/bin:$PATH"

RUN useradd -m -u 1000 appuser && \
    mkdir -p /app && \
    chown -R appuser:appuser /app

COPY --from=builder --chown=appuser:appuser /root/.local /home/appuser/.local

WORKDIR /app

# Le package `backend` doit être importable depuis /app (PYTHONPATH=/app)
COPY --chown=appuser:appuser backend/ ./backend/
COPY --chown=appuser:appuser blog_content/ ./blog_content/

USER appuser

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health', timeout=5)"

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "1"]
