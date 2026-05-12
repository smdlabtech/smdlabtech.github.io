# Comment tout ça marche — et comment l’implémenter

Ce document décrit **le fonctionnement global** de la plateforme (Jekyll + Flask, CI/CD, déploiement) et **les étapes concrètes** pour l’exécuter en local et en production.

---

## 1. Vue d’ensemble

La plateforme comporte **deux stacks** qui coexistent :

| Stack | Rôle | Où | Déploiement |
|-------|------|-----|-------------|
| **Jekyll** | Site statique (blog, pages, assets) | `app/` (sources : `_config.yml`, `_layouts/`, `_posts/`, `_includes/`, `assets/`, `data/` → build → `app/_site/`) | GitHub Pages (déploiement de `_site/` uniquement) |
| **Flask** | API REST + pages dynamiques (/, /about, /blog, /monitoring) | `app/run.py` + `app/src/` | Cloud Run (optionnel) |

En parallèle, une **nouvelle architecture** (Backend FastAPI + Frontend Flask séparés) est décrite dans `docs/MIGRATION_FASTAPI_FLASK.md` ; le présent guide se concentre sur **l’usage actuel** (Jekyll + Flask dans `app/`).

---

## 2. Comment les pièces s’emboîtent

### 2.1 Application Flask (`app/`)

```
run.py
  │
  ├── sys.path ← app/   (pour que "import src" fonctionne)
  ├── create_app(FLASK_ENV)  dans  src/__init__.py
  │     ├── Config (base → development | production | testing)
  │     ├── DB (SQLAlchemy), CORS, logging, rate limiting
  │     ├── Blueprints : main, blog, admin, api_routes, export_routes, api/v1 (articles, projects, experiences)
  │     ├── Erreurs, health, métriques, sécurité, filtres Jinja2
  │     └── return app
  └── app.run(host='0.0.0.0', port=8080)
```

- **Point d’entrée** : `app/run.py` — c’est le seul fichier à lancer pour démarrer Flask.
- **Toute la logique** est dans `app/src/` (routes, services, DB, templates, static). Voir `app/README.md` et `app/src/README.md`.

### 2.2 Jekyll (site statique)

- **Sources** (dans `app/`) : `_config.yml`, `_layouts/`, `_includes/`, `_posts/`, `assets/`, `data/`, `index.html`, `about.md`, etc. Ces dossiers sont **bien intégrés** : Jekyll les lit au build.
- **Build** : `bundle exec jekyll build` → sortie dans **`app/_site/`** (généré, non versionné).
- **Déploiement** : le contenu de **`app/_site/`** seul est déployé sur GitHub Pages ; `_layouts/`, `_posts/`, etc. ne sont pas envoyés tels quels, ils servent uniquement à produire `_site/`.
- **Serveur local** : `bundle exec jekyll serve` → http://localhost:4000.

Jekyll et Flask **ne partagent pas de processus** : ce sont deux serveurs distincts. Flask n’utilise pas `_layouts/` ni `_posts/` ; il a ses propres `app/src/templates/` et `app/src/static/`. Pour le détail des dossiers Jekyll, voir **[app/README.md](../app/README.md)** (section « Comment les dossiers Jekyll s’intègrent à la plateforme »).

### 2.3 Workflows GitHub Actions

| Fichier | Déclencheur | Rôle |
|---------|-------------|------|
| **ci.yml** | Push/PR sur `main` ou `develop` | Tests, lint, traductions, build Jekyll, build Docker, déploiement Pages + Cloud Run (sur push `main`). |
| **jekyll-pages.yml** | Push `main` avec changements dans `app/**` ou le workflow | Build Jekyll depuis `app/`, déploie l’artefact vers GitHub Pages. |
| **deploy.yml** | Push `main` avec changements dans `app/**` (Flask/Docker) ou manuel | Valide Dockerfile, build image, déploie sur Cloud Run (Flask). |

- **Frontend (Pages)** : le contenu de `app/_site/` est déployé comme site GitHub Pages (URL du repo, ex. `https://<org>.github.io/<repo>/`).
- **Backend (Cloud Run)** : l’image Docker construite depuis `app/Dockerfile` est poussée puis déployée sur Cloud Run (service Flask, port 8080). Les secrets (GCP, etc.) sont dans les variables/secrets du dépôt.

---

## 3. Implémentation — En local

### 3.1 Prérequis

- **Python 3.10+** (pour Flask)
- **Ruby 3.1** + Bundler (pour Jekyll)
- Optionnel : **Node.js** si vous utilisez des scripts front (ex. build assets)

### 3.2 Lancer l’application Flask (backend actuel)

**Sans script dédié** (toujours possible) :

```bash
cd app
python3 -m venv .venv    # une seule fois
source .venv/bin/activate
pip install -r requirements.txt
python run.py
```

→ Serveur sur **http://localhost:8080** (/, /about, /blog, /api/..., /health, /metrics).

**Avec Makefile** (si `scripts/dev/launch_app.sh` n’existe pas, le Makefile fait `cd app && python run.py`) :

```bash
make run-flask
```

**Avec script** (si vous créez `scripts/dev/launch_app.sh`) : ce script peut faire `cd app`, activer un venv (`.venv` ou `venv`), puis lancer `python run.py`. Voir `app/README.md` pour la doc.

### 3.3 Lancer Jekyll (site statique)

```bash
cd app
bundle install
bundle exec jekyll serve
```

→ **http://localhost:4000**

Ou via Makefile :

```bash
make run-jekyll
```

### 3.4 Variables d’environnement (Flask)

- En dev, vous pouvez utiliser un fichier **`.env`** dans `app/` (ou à la racine) si votre config le charge (ex. `python-dotenv`).
- Exemple : `FLASK_ENV=development`, `PORT=8080`, `RATELIMIT_STORAGE_URL=memory://` (sans Redis). Voir `docs/ENV_VARIABLES.md` si présent.

### 3.5 Vérifications rapides

- **API (Swagger)** : http://localhost:8080/docs · **Health** : http://localhost:8080/health
- Rate limit (info) : `curl http://localhost:8080/api/rate-limit`
- Tests : depuis la racine, `PYTHONPATH=app python3 -m pytest tests/ -v` (ou `make test`)

---

## 4. Implémentation — CI/CD et déploiement

### 4.1 Ce qui se passe sur push / PR

1. **ci.yml** (sur push/PR `main` ou `develop`)  
   - Tests & lint : Python (pytest, flake8, black, isort), validation des traductions.  
   - Security : Trivy, TruffleHog.  
   - Build Jekyll : `app/_site/` produit et artefact “pages” uploadé.  
   - Sur **push sur `main`** uniquement :  
     - Build Docker (contexte `app/`, image Flask) → GHCR.  
     - Deploy frontend : GitHub Pages (artefact `app/_site/`).  
     - Deploy backend : Cloud Run avec l’image construite, puis health check sur `/health`.

2. **jekyll-pages.yml**  
   - Se déclenche sur push `main` quand `app/**` ou le workflow change.  
   - Build Jekyll dans `app/`, vérifie `_site/`, uploade l’artefact pour GitHub Pages.

3. **deploy.yml**  
   - Déploiement Flask sur Cloud Run (build image depuis `app/`, push, deploy). Utilise les secrets GCP (ex. `GCP_SA_KEY`).

### 4.2 Configurer le déploiement

- **GitHub Pages** : dans les paramètres du dépôt, activer “GitHub Actions” comme source pour Pages. Les workflows qui utilisent `deploy-pages` alimentent cette source.
- **Cloud Run** :  
  - Créer un projet GCP, activer Cloud Run et Artifact Registry.  
  - Créer un compte de service avec les droits nécessaires, récupérer une clé JSON.  
  - Ajouter dans les **Secrets** du repo : `GCP_SA_KEY` (JSON du compte de service).  
  - Variables éventuelles : `GCP_PROJECT_ID`, `GCP_REGION` (sinon valeurs par défaut dans les workflows).

### 4.3 Déclencher à la main

- **Actions** → choisir le workflow (CI/CD, Deploy Jekyll, Deploy to Cloud Run) → “Run workflow”.  
- Certains workflows proposent des options (ex. `environment`, `debug`).

---

## 5. Résumé des commandes utiles

| Objectif | Commande |
|----------|----------|
| Lancer Flask (app/) | `cd app && python run.py` ou `make run-flask` |
| Lancer Jekyll | `cd app && bundle exec jekyll serve` ou `make run-jekyll` |
| Tests | `PYTHONPATH=app python3 -m pytest tests/ -v` ou `make test` |
| Health local | `curl http://localhost:8080/health` |
| Build Jekyll (sans serveur) | `cd app && bundle exec jekyll build` |

---

## 6. Où trouver plus d’infos

- **Structure du repo** : `docs/STRUCTURE.md`  
- **App (Jekyll + Flask)** : `app/README.md`  
- **Intégration de `app/src/`** : `app/README.md` (section “Comment app/src/ s’intègre à la plateforme”) et `app/src/README.md`  
- **Migration FastAPI + Flask** : `docs/MIGRATION_FASTAPI_FLASK.md`  
- **Variables d’environnement** : `docs/ENV_VARIABLES.md`  
- **Contribuer** : `docs/CONTRIBUTING.md`
