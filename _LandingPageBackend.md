# Landing page backend (port 8080) — documentation d’implémentation

Ce document explique **comment** la plateforme SMD LabTech expose une **landing HTML** et une **page observabilité** sur le **même port que l’API FastAPI** (8080 par défaut), et comment elles s’alignent sur le reste du dépôt.

---

## 1. Objectif

- Offrir une **entrée humaine** sur `http://127.0.0.1:8080/` (au lieu d’un JSON opaque ou d’un simple message).
- Centraliser la **documentation courte** des endpoints, du lien vers le frontend Next.js, du CORS et du rôle des fichiers Markdown.
- Fournir une **deuxième page** dédiée au **monitoring** : `/monitoring` (alias `/monitoring.html`).
- Garder une **découverte machine** via `GET /api` (JSON léger) sans supprimer les routes OpenAPI existantes (`/docs`, `/redoc`, `/openapi.json`).

---

## 2. Fichiers concernés

| Fichier | Rôle |
|---------|------|
| `backend/app/index.html` | Landing principale (FR/EN, `data-i18n`, `localStorage`). |
| `backend/app/monitoring.html` | Page observabilité (ports, compose, scrape Prometheus). |
| `backend/app/main.py` | Routes FastAPI qui servent ces fichiers et redirections. |
| `monitoring/prometheus/prometheus.yml` | Alignement du scrape sur **FastAPI** (suppression du filtre `flask_*`). |

Ancienne page `frontend/public/monitoring.html` : **supprimée** pour éviter la duplication ; la référence unique est désormais le **backend sur 8080**.

---

## 3. Routage FastAPI (`backend/app/main.py`)

| Route | Comportement |
|-------|----------------|
| `GET /` | Sert `app/index.html` (**landing**). |
| `GET /monitoring` et `GET /monitoring.html` | Servent `app/monitoring.html`. |
| `GET /ui` | **Redirection 302** vers `/` (compatibilité avec l’ancien chemin documenté). |
| `GET /api` | JSON de découverte : `docs`, `health`, `metrics`, `v1`, `posts`, `posts_hint`, `related_hint`, `blog_assets_hint`, `landing`. |
| `GET /healthz`, `GET /metrics`, `/docs`, `/api/v1/*` | Inchangés fonctionnellement. |

### Rate limiting (même port 8080)

Les routes JSON sous `/api/v1/` peuvent renvoyer **429 Too Many Requests** si les plafonds slowapi sont dépassés. La découverte des limites configurées est disponible via **`GET /api/v1/rate-limit`** (JSON). Pour les tests locaux ou un reverse proxy qui applique sa propre politique, vous pouvez désactiver le limiteur avec **`RATE_LIMIT_ENABLED=false`** dans l’environnement du backend (voir `backend/README.md`).

Les fichiers statiques sont résolus avec :

`HTML_DIR = Path(__file__).resolve().parent`

(c’est-à-dire `backend/app/` à partir de `backend/app/main.py`).

---

## 4. Internationalisation des pages HTML (sans duplication FR/EN)

**Principe** : une seule page HTML par ressource ; le texte change selon la langue.

- Chaque chaîne affichée porte un attribut **`data-i18n="clé.stable"`** (ex. `doc.heroTitle`, `mon.secPorts`).
- Un script inline en fin de fichier charge un objet **`I18N.fr`** et **`I18N.en`** (dictionnaires clé → texte).
- Au chargement (`DOMContentLoaded`) :
  1. Lecture de **`localStorage.getItem('locale')`** — clé **`locale`**, **identique** au frontend Next.js (`LocaleProvider`), pour un comportement cohérent entre `localhost:3000` et `localhost:8080`.
  2. Application des textes sur tous les éléments `[data-i18n]` (`textContent` ; pour `<title>`, mise à jour de `document.title`).
  3. Mise à jour des boutons FR/EN (classe `.active`).

**Contrainte technique** : les nœuds portant `data-i18n` ne doivent **pas** mélanger HTML riche et traduction (sinon `textContent` écrase les enfants). D’où des formulations en texte brut pour les passages qui mentionnaient autrefois des balises `<code>` à l’intérieur du même nœud.

---

## 5. Contenu adapté à la plateforme SMD LabTech

### `index.html` (landing)

- **Positionnement** : API FastAPI du blog, port 8080, lien vers Next.js `127.0.0.1:3000`.
- **Hero** : bandeau léger (halos / dégradés, sans gros cadre « carte ») — titre sur deux lignes (accent en dégradé), pastilles, CTA vers `/docs`, `/metrics`, `/healthz`, astuce ; les exemples `curl` et PromQL restent dans les sections plus bas.
- **Sections** (style page d’API « produit ») : **accès rapide** (cartes vers `/docs`, `/redoc`, `/healthz`, `/metrics`, `/monitoring`, `/api`), **tableau des routes** (méthode + chemin + rôle), **exemples `curl`**, **extraits PromQL** alignés sur le job `site-blog-backend`, rappel des endpoints, architecture Markdown, CORS et variables `RATE_LIMIT_*`.
- **Navigation** : liens relatifs vers `/`, `/api`, `/monitoring`, `/docs`, `/redoc`, `/metrics` (même origine, même port).

### `monitoring.html`

- **Table des ports** alignée sur `monitoring/PORTS.md` (8080 API, 3000 Next, 3030 Grafana, 9090 Prometheus).
- **Commande** : `docker compose -f monitoring/docker-compose.observability.yml up -d`.
- **Scrape** : rappel que les métriques ne sont plus `flask_*` après migration FastAPI.

---

## 6. Prometheus — amélioration associée

Le fichier `monitoring/prometheus/prometheus.yml` a été **réécrit** pour :

- Renommer le job et les labels (`site-blog-backend`, `site-blog-fastapi`).
- **Supprimer** le bloc `metric_relabel_configs` qui ne gardait que `flask_.*` (incompatible avec FastAPI + `prometheus_client`).

Sans ce changement, Prometheus pouvait scraper `/metrics` mais **ne conservait aucune série** utile.

---

## 7. Comment tester en local

```bash
./scripts/dev/run-backend.sh
```

Puis dans un navigateur :

- `http://127.0.0.1:8080/` — landing
- `http://127.0.0.1:8080/monitoring` — observabilité
- `http://127.0.0.1:8080/api` — JSON de découverte
- `http://127.0.0.1:8080/docs` — Swagger

Vérifier le toggle FR/EN et rouvrir l’onglet : la langue doit persister (`localStorage`).

---

## 8. Déploiement (Docker / Cloud Run)

L’image **`backend/Dockerfile`** est construite **depuis la racine du dépôt** (`docker build -f backend/Dockerfile .`) : elle copie le code sous **`backend/`** (dont **`app/index.html`**, **`app/monitoring.html`**) et le répertoire **`blog_content/`** vers **`/blog_content`**, avec la variable **`BLOG_CONTENT_DIR=/blog_content`**, pour que les routes **`/api/v1/posts`** et **`/api/v1/blog-assets/...`** fonctionnent comme en local.

Starlette/FastAPI sert les HTML avec le bon **`Content-Type`**. En **HTTPS** sur Cloud Run, les liens **relatifs** (`/docs`, `/monitoring`, `/api`) restent corrects.

Voir **`README.md`** (racine), **`scripts/deployment/deploy-backend.sh`** et **`backend/README.md`** (section Cloud Run).

---

## 9. Évolutions possibles (hors scope immédiat)

- Factoriser le **moteur i18n** JS dans un petit fichier partagé servi par FastAPI (ex. route `/static/i18n.js`) pour éviter la duplication entre `index.html` et `monitoring.html`.
- Servir une variante **minifiée** des HTML en build CI.
- Ajouter des **tests Playwright** ou `curl` sur `/` et `/monitoring` dans la CI.

---

*Document généré pour expliquer l’état du dépôt après intégration landing + monitoring sur le port 8080.*
