# Makefile – cibles courantes (dev, tests, i18n, santé)
# Usage : make [cible]

.PHONY: help setup test test-rate-limit run-flask run-jekyll run-backend run-frontend run-all validate-i18n health docs-inventory docs-inventory-full docker-build docker-up docker-down docker-logs

help:
	@echo "Cibles disponibles:"
	@echo ""
	@echo "  make run-all        - Backend + Frontend en un seul terminal (Ctrl+C pour arrêter)"
	@echo "  make run-backend    - Backend FastAPI  → http://localhost:8080  (API: /docs, Health: /health)"
	@echo "  make run-frontend   - Frontend Flask   → http://localhost:3000  (nécessite backend sur 8080)"
	@echo "  make run-flask      - Backend Flask (backend/src/) → http://localhost:8080"
	@echo "  make run-jekyll     - Jekyll (backend/src/) → http://localhost:4000"
	@echo ""
	@echo "  make docker-build   - Build l'image FastAPI (context = racine du projet)"
	@echo "  make docker-up      - Lance la stack Docker (FastAPI + Redis)"
	@echo "  make docker-down    - Arrête la stack Docker"
	@echo "  make docker-logs    - Suit les logs du container backend"
	@echo ""
	@echo "  make setup          - Environnement (venv, deps, Jekyll bundle)"
	@echo "  make test           - Tests Python (pytest)"
	@echo "  make test-rate-limit - Tests rate limiting uniquement"
	@echo "  make validate-i18n  - Valide les traductions (scripts/i18n)"
	@echo "  make health         - Healthcheck local (scripts/ops)"
	@echo "  make docs-inventory - Regénère l'inventaire Markdown (README compact + docs complet)"
	@echo "  make docs-inventory-full - Regénère l'inventaire Markdown (README complet + docs complet)"

setup:
	@if [ -f scripts/dev/setup_complete.sh ]; then ./scripts/dev/setup_complete.sh; else echo "Script non trouvé: scripts/dev/setup_complete.sh"; exit 1; fi

test:
	PYTHONPATH=. python3 -m pytest tests/ -v

test-rate-limit:
	PYTHONPATH=. python3 -m pytest tests/test_rate_limiting.py -v

run-backend:
	@if [ -f scripts/dev/run-backend.sh ]; then ./scripts/dev/run-backend.sh; else echo "Backend (FastAPI) → http://localhost:8080"; echo "  API : http://localhost:8080/docs  |  Health : http://localhost:8080/health"; uvicorn backend.main:app --reload --port 8080; fi

run-frontend:
	@if [ -f scripts/dev/run-frontend.sh ]; then ./scripts/dev/run-frontend.sh; else echo "Frontend (Flask) → http://localhost:3000  (backend attendu sur http://localhost:8080)"; BACKEND_URL=http://localhost:8080 flask --app frontend.app run --port 3000; fi

run-all:
	@if [ -f scripts/dev/run-all.sh ]; then ./scripts/dev/run-all.sh; else echo "Script non trouvé: scripts/dev/run-all.sh"; exit 1; fi

run-flask:
	@if [ -f scripts/dev/launch_app.sh ]; then ./scripts/dev/launch_app.sh; else (cd backend/src && python run.py); fi

run-jekyll:
	@(cd backend/src && bundle exec jekyll serve)

docker-build:
	docker build -f backend/Dockerfile -t portfolio-api .

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f backend

validate-i18n:
	@if [ -f scripts/i18n/validate_translations.sh ]; then ./scripts/i18n/validate_translations.sh; else echo "Script non trouvé: scripts/i18n/validate_translations.sh"; exit 1; fi

health:
	@if [ -f scripts/ops/healthcheck.sh ]; then ./scripts/ops/healthcheck.sh; else echo "Script non trouvé: scripts/ops/healthcheck.sh"; exit 1; fi

docs-inventory:
	python3 scripts/misc/generate_markdown_inventory.py --readme-mode compact

docs-inventory-full:
	python3 scripts/misc/generate_markdown_inventory.py --readme-mode full
