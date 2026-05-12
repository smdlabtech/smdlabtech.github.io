# Fusion backend + backend_old — Un seul backend FastAPI

## Contexte

- **backend/** : contient désormais un seul **FastAPI** à la racine (main.py, config.py, routers/) ; **backend/app/** ne contient plus de doublon FastAPI (main.py, config.py, routers/ supprimés).
- **backend_old/** : ancien site **Jekyll** (Gemfile, _includes, _layouts, _posts, assets, data) + un **run.py** Flask qui importait `src` (absent dans backend_old) → **inutilisable**.

## Ce qui a été fait

### 1. Un seul backend FastAPI à la racine de `backend/`

Le backend canonique est maintenant **à la racine de backend/** (et non plus dans backend/app/) :

| Fichier | Rôle |
|--------|------|
| **backend/main.py** | Application FastAPI (point d’entrée `uvicorn backend.main:app`) |
| **backend/config.py** | Configuration (env : APP_NAME, DATABASE_URL, CORS_ORIGINS) |
| **backend/routers/health.py** | `/health`, `/health/ready`, `/health/live` |
| **backend/routers/api_v1.py** | `/api/v1/articles`, `/api/v1/projects`, `/api/v1/experiences` |
| **backend/requirements-api.txt** | Dépendances FastAPI (fastapi, uvicorn, python-dotenv) |

Les scripts **run-backend.sh** et **make run-backend** pointent déjà vers `backend/main.py` et fonctionnent avec cette structure.

### 2. Ce qui reste où

- **backend/app/** : conservé pour l’instant (Flask + Jekyll + assets). À terme, on peut :
  - déplacer le contenu Jekyll/statique vers le dossier **app/** à la racine du repo (site principal),
  - ou archiver / supprimer **backend/app/** si tout est migré.
- **backend_old/** : **archivable**. Contenu utile à récupérer éventuellement :
  - **assets/** (CSS/JS) : à copier vers **app/** (racine) si besoin de thèmes ou scripts.
  - **_includes/, _layouts/, _posts/, data/** : à fusionner dans **app/** si vous unifiez le site Jekyll.
  - Une fois la fusion faite, vous pouvez renommer **backend_old** en **backend_old_archive** ou le supprimer.

### 3. Récapitulatif

| Avant | Après |
|-------|--------|
| ~~backend/app/main.py, config.py, routers/~~ (supprimés) | Backend FastAPI uniquement dans **backend/main.py**, **backend/config.py**, **backend/routers/** |
| backend_old = Jekyll + run.py Flask cassé | backend_old = archive ; contenu utile à copier vers **app/** |
| Deux “backends” (app Flask + app FastAPI dans backend/app) | **Un seul backend** = FastAPI (backend/main.py) ; Flask reste dans **app/** (racine) si besoin |

## Suite possible

- Brancher **backend/routers/api_v1.py** sur la base de données ou les services de **app/** (backend/app/src) si vous voulez des données réelles.
- Fusionner les assets et le contenu Jekyll de **backend_old** dans **app/** puis supprimer ou archiver **backend_old**.
