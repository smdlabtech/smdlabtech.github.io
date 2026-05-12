# backend/app/ — Flask et données (legacy)

Ce dossier contient l’application **Flask** (run.py) et la logique métier (config, routes, services, database, api v1 en Blueprints). Les **doublons FastAPI** (main.py, config.py, routers/) ont été **supprimés** : le backend API officiel est **backend/** (parent).

## Rôle

| Élément | Description |
|--------|-------------|
| **run.py** | Point d’entrée Flask : `python run.py` (depuis ce répertoire, port 8080). |
| **config/**, **routes/**, **services/**, **database/**, **api/** | Logique Flask (create_app dans __init__.py, imports depuis `src.*`). |
| **data/** | YAML (articles.yml, projects.yml) utilisés par le **backend FastAPI** (backend/data/loader.py). |

## Backend FastAPI (officiel)

- **Point d’entrée** : depuis la **racine du repo** : `uvicorn backend.main:app --reload --port 8080` ou `./scripts/dev/run-backend.sh`.
- **Fichiers** : **backend/main.py**, **backend/config.py**, **backend/routers/**, **backend/data/**, **backend/schemas.py**.

Voir **[../README.md](../README.md)** et **[../../docs/COMPARAISON_BACKEND_APP_SRC.md](../../docs/COMPARAISON_BACKEND_APP_SRC.md)**.
