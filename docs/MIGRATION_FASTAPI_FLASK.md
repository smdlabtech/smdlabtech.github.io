# Migration : Backend FastAPI + Frontend Flask

## Objectif

Passer d’une architecture **Jekyll (frontend) + Flask (backend monolith)** à une architecture **Backend FastAPI + Frontend Flask**.

---

## État actuel du repo

| Composant | Avant | Rôle |
|-----------|--------|------|
| **Frontend** | Jekyll dans `app/` | Site statique (blog, pages), déployé sur GitHub Pages |
| **Backend** | Flask dans `app/` | API + templates (/, /about, /blog, /monitoring), health, rate limiting |
| **CI/CD** | jekyll-pages.yml, deploy.yml, ci.yml | Build Jekyll → Pages ; Build Flask → Cloud Run |

---

## Nouvelle architecture (en cours)

| Composant | Emplacement | Rôle |
|-----------|-------------|------|
| **Backend** | `backend/` (FastAPI) | API REST uniquement : `/api/v1/articles`, `/api/v1/projects`, `/api/v1/experiences`, `/health`, etc. |
| **Frontend** | `frontend/` (Flask) | Pages HTML (templates Jinja2), appelle le backend via HTTP (`BACKEND_URL`) |
| **Ancien** | `app/` | Conservé pendant la transition (Jekyll + Flask actuel) ; à retirer ou archiver une fois la migration terminée |

---

## Structure créée

```
backend/                 # FastAPI
├── main.py              # App FastAPI, CORS, routers
├── config.py            # Settings (env)
├── requirements.txt
└── routers/
    ├── health.py        # /health, /health/ready, /health/live
    └── api_v1.py        # /api/v1/articles, projects, experiences

frontend/                # Flask
├── app.py               # create_app(), routes /, /about, /blog/, /monitoring
├── requirements.txt
├── templates/           # base, index, about, blog_list, monitoring
└── static/css/style.css
```

---

## Lancer en local

### 1. Backend FastAPI (port 8080)

```bash
cd /chemin/vers/repo
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate sur Windows
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8080
```

→ API : http://localhost:8080
→ Docs : http://localhost:8080/docs
→ Health : http://localhost:8080/health

### 2. Frontend Flask (port 3000)

```bash
# Dans le même venv ou un autre
pip install -r frontend/requirements.txt
export BACKEND_URL=http://localhost:8080
flask --app frontend.app run --port 3000
```

→ Site : http://localhost:3000  

Le frontend appelle le backend via `BACKEND_URL` pour les données (ex. liste d’articles).

---

## Suite de la migration

1. **Backend FastAPI**
   - Connecter la base de données (SQLAlchemy ou autre) et réutiliser les modèles de `app/src/database/`.
   - Implémenter la logique des services (`app/src/services/`) dans les routeurs ou services FastAPI.
   - Ajouter rate limiting, métriques Prometheus, `/api/rate-limit` (équivalent de l’actuel Flask).

2. **Frontend Flask**
   - Enrichir les templates (i18n, design aligné sur l’ancien site).
   - Migrer le contenu blog (posts Jekyll → API ou DB).
   - Déployer le frontend (Cloud Run, autre) et configurer `BACKEND_URL` en prod.

3. **CI/CD**
   - Remplacer le déploiement Jekyll par le build/déploiement du frontend Flask.
   - Adapter `deploy.yml` pour le backend FastAPI (image + Cloud Run).
   - Tests : pytest pour FastAPI (TestClient), tests frontend si besoin.

4. **Nettoyage**
   - Une fois la migration validée : archiver ou supprimer `app/` (Jekyll + ancien Flask).
   - Mettre à jour README, docs (STRUCTURE.md, CONTRIBUTING.md).

---

## Variables d’environnement

| Variable | Backend (FastAPI) | Frontend (Flask) |
|----------|-------------------|-------------------|
| `DATABASE_URL` | Oui (si DB) | Non |
| `CORS_ORIGINS` | Oui | — |
| `BACKEND_URL` | — | Oui (URL de l’API) |

---

**Dernière mise à jour** : 2026-02
