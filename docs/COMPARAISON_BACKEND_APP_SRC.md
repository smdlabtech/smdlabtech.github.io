# Comparaison backend/app/ et backend/app/src/

## Vue d’ensemble

| Dossier | Rôle | Point d’entrée |
| ------- | ---- | -------------- |
| **backend/app/** | Conteneur mixte : **Flask legacy** (run.py), **Jekyll** (assets, data, _config) et pages statiques. | `python backend/app/run.py` |
| **backend/app/src/** | **Application Flask canonique** : factory `create_app()`, config, DB, routes, services, API v1 (Flask), monitoring, rate limiting. | Utilise par **backend/app/run.py** |

## backend/app/ (racine de app)

- **run.py** : point d’entrée Flask ; ajoute `app/` au `PYTHONPATH`, appelle `src.create_app()`.
- **src/** : toute la logique Flask (voir ci-dessous).
- **data/**, **assets/**, **_config.yml**, **tags/**, etc. : Jekyll / données / statique.
- **archives internes deplaces** : `site/`, `blueprints/`, `routers/`, `data-flask/` -> `__archives/backend_app/`.

## backend/app/src/ (Flask uniquement)

- `__init__.py` : `create_app()` — Flask avec config, DB, CORS, rate limiting, health et metriques.
- **config/** : base, development, production, testing (Flask).
- **database/** : extensions (Flask-SQLAlchemy, Migrate), models (Article, Project, Experience, Tag, Author, etc.).
- **services/** : BlogService, ProjectService, ExperienceService (utilisent `db` et les models).
- **routes/** : main, blog, admin, api_routes, export_routes (Flask).
- **api/v1/** : articles, projects, experiences en Flask Blueprint.
- **monitoring/**, **middleware/**, **rate_limiting.py**, **errors.py**, **filters.py** : logging, sante, securite, erreurs, Jinja2.
- Cette structure ne contient plus de symlinks: ce sont des modules reels.

## Ce qui a été amélioré

1. **Un seul backend FastAPI** à la racine de **backend/** : **backend/main.py**, **backend/config.py**, **backend/routers/** (health, api_v1). C’est la version de référence pour l’API (port 8080).
2. **Données réelles pour l’API** : **backend/data/loader.py** charge **backend/app/data/articles.yml** et **projects.yml** ; **backend/routers/api_v1.py** sert ces données (plus de réponses vides).
3. **backend/app/main.py, config.py, routers/** : supprimes (doublons FastAPI).
4. **Fusion Python backend/app -> backend/app/src** : les modules `api/auth/config/database/middleware/monitoring/routes/services/utils` et `errors.py/filters.py/rate_limit*.py` ont ete deplaces dans `src/`.
5. **Archives de nettoyage** : les elements redondants sont conserves temporairement dans `__archives/backend_app/`.

## Recommandations

- **Utiliser uniquement le backend FastAPI** (backend/main.py) pour l’API REST ; le frontend (frontend/) et tout client doivent appeler **`http://localhost:8080`**.
- **Supprimer `__archives/backend_app/` par lots** apres validation complete CI et tests manuels.
- **Limiter le Python Flask a `backend/app/src/`** pour eviter tout retour de duplication.
