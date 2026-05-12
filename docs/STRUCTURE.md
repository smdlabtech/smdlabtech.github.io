# 📁 Structure du Repository

## Vue d'ensemble

Ce repository contient une plateforme complète combinant :
- **Frontend Jekyll** : Site statique déployé sur GitHub Pages (sources dans `backend/app/`)
- **Backend FastAPI** : API REST principale dans `backend/`
- **Frontend Flask** : UI serveur dans `frontend/` qui consomme l'API FastAPI
- **Backend Flask legacy** : composant historique dans `backend/app/src/`
- **CI/CD** : Automatisation avec GitHub Actions
- **Monitoring** : Stack d'observabilité (Prometheus, Grafana, Loki)

Pour une vue d’ensemble du **fonctionnement** et des **étapes d’implémentation** (local + déploiement), voir **[COMMENT_CA_MARCHE_ET_IMPLEMENTATION.md](COMMENT_CA_MARCHE_ET_IMPLEMENTATION.md)**.

## Structure Détaillée

### `/backend/app/` – Jekyll (frontend statique) + Flask legacy

**Deux logiques distinctes** — voir [backend/app/README.md](../backend/app/README.md) pour le détail.

```
backend/app/
├── _config.yml, _layouts/, _includes/, _posts/, assets/, data/
│   → Jekyll (site statique, GitHub Pages)
├── run.py                   # Point d'entrée Flask
├── src/                     # Toute la logique Flask (un seul endroit)
│   ├── __init__.py          # create_app(), enregistrement des blueprints
│   ├── config/              # base, development, production, testing
│   ├── routes/              # Routes web + API (main, blog, admin, api_routes, export_routes)
│   ├── api/v1/              # articles, projects, experiences
│   ├── services/            # blog_service, cache_service, etc.
│   ├── database/            # models, extensions
│   ├── monitoring/          # health, metrics
│   ├── templates/           # Jinja2 (base, index, about, blog/, api/, errors/)
│   ├── static/
│   ├── rate_limiting.py
│   └── ...
├── blueprints/              # Déprécié — code déplacé dans src/routes/
├── scripts/                 # test-local.sh, etc.
└── _archive/                # Anciens CSS/JS (exclus du build)
```

### `/.github/workflows/` - CI/CD

```
.github/workflows/
├── ci.yml                  # Pipeline unifié (tests, lint, build, deploy)
├── jekyll-pages.yml        # Déploiement Jekyll sur GitHub Pages
└── deploy.yml              # Déploiement Flask (Cloud Run)
```

### `/backend/` - API FastAPI

```
backend/
├── main.py                  # Point d'entrée FastAPI
├── routers/                 # health, api_v1
├── rate_limiter.py
└── app/                     # Legacy Jekyll + Flask
```

### `/frontend/` - UI Flask

```
frontend/
├── app.py
├── templates/
└── static/
```

### `/scripts/` - Scripts Utilitaires

Voir **[scripts/README.md](../scripts/README.md)** pour l’organisation complète.

```
scripts/
├── dev/                    # Setup, .env, DB, lancement Flask
├── quality/                # Tests, quick_test, validate_translations
├── build/                  # Jekyll (setup_jekyll, launch_jekyll)
├── i18n/                   # compile-translations, validate_translations
├── ops/                    # healthcheck
├── lib/                    # logging.sh, require.sh, common.sh
└── README.md
```

### `/monitoring/` - Observabilité

```
monitoring/
├── docker-compose.observability.yml
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── alertmanager/
└── ...
```

## Fichiers de Configuration

### Configuration Jekyll
- `backend/app/_config.yml` : Configuration principale Jekyll
- `backend/app/Gemfile` : Dépendances Ruby
- `backend/app/staticman.yml` : Configuration commentaires

### Configuration Python
- `backend/app/requirements.txt` : Dépendances Flask legacy
- `backend/requirements-api.txt` : Dépendances FastAPI
- `backend/app/pyproject.toml` : Configuration tooling Python
- `backend/app/run.py` : Point d'entrée Flask legacy

### Configuration CI/CD
- `.github/workflows/jekyll-pages.yml` : Workflow GitHub Pages
- `.pre-commit-config.yaml` : Hooks pre-commit

### Configuration Docker
- `monitoring/docker-compose.observability.yml` : Stack observabilité locale
- `backend/app/Dockerfile` : Image Docker backend legacy

## Fichiers Ignorés

Les fichiers suivants sont ignorés par Git (voir `.gitignore`) :
- `backend/app/_site/` : Build output Jekyll
- `__archives/backend_app/site/` : ancien build output deplace pour nettoyage
- `.venv/`, `venv/` : Environnements virtuels Python
- `__pycache__/` : Cache Python
- `.env*` : Variables d'environnement
- `*.log` : Fichiers de logs
- `*.db`, `*.sqlite` : Bases de données locales

## Workflow de Développement

1. **Développement Local**
   - Jekyll : `cd backend/app && bundle exec jekyll serve`
   - API FastAPI : `uvicorn backend.main:app --reload --port 8080`
   - Frontend Flask : `flask --app frontend.app run --port 3000`

2. **Commit**
   - Pre-commit hooks vérifient le code
   - Tests automatiques

3. **Déploiement**
   - Push sur `main` déclenche le workflow
   - Jekyll build et déploiement sur GitHub Pages
   - Site disponible sur `https://smdlabtech.github.io/`

## Bonnes Pratiques

- ✅ Séparer frontend (Jekyll + Flask UI) et backend API (FastAPI)
- ✅ Utiliser des workflows GitHub Actions pour CI/CD
- ✅ Documenter la structure du projet
- ✅ Ignorer les fichiers de build et temporaires
- ✅ Utiliser pre-commit hooks pour la qualité du code
