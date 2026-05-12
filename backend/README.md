# Backend FastAPI

API REST du portfolio (articles, projets, expériences). Point d'entrée unique : **backend.main:app**.

## Structure (backend FastAPI)

```text
backend/
├── __init__.py
├── main.py           # FastAPI app (point d'entrée unique)
├── config.py         # Settings (env)
├── schemas.py        # Pydantic (ArticleOut, ProjectOut, ExperienceOut)
├── routers/
│   ├── __init__.py
│   ├── health.py     # /health, /health/ready, /health/live
│   └── api_v1.py     # /api/v1/articles, projects, experiences (données YAML)
├── data/
│   ├── __init__.py
│   └── loader.py     # Charge YAML (backend/data canonique + fallbacks legacy)
└── src/              # Legacy en cours d'assainissement (compatibilité)
```

## Lancer

Depuis la racine du repo :

```bash
./scripts/dev/run-backend.sh
# ou
make run-backend
# ou
uvicorn backend.main:app --reload --port 8080
```

- **API** : `http://localhost:8080/docs`  
- **Health** : `http://localhost:8080/health`  

## Dépendances

- Pour le backend FastAPI seul : `pip install -r requirements/requirements-api.txt`
- Le venv racine peut aussi installer les requirements frontend/legacy selon le besoin.

## Variables backend utiles

- `BACKEND_DATA_DIR` : force un dossier de données YAML custom.
- `BACKEND_DATA_DIR_STRICT` : si `true`, force la source canonique `backend/data`.
- `RATE_LIMIT_ENABLED` : active/désactive le rate limiting.
- `RATE_LIMIT_STORAGE_URL` : backend rate limit (`memory://` ou `redis://...`).

## Fusion avec backend_old

Le dossier **backend_old/** contenait l’ancien site Jekyll + un `run.py` Flask inutilisable. Le backend canonique est désormais **backend/** (FastAPI uniquement). Les assets/layouts utiles de backend_old peuvent être fusionnés dans le dossier **app/** (Jekyll) à la racine du repo. Voir **docs/MERGE_BACKEND_BACKEND_OLD.md**.
