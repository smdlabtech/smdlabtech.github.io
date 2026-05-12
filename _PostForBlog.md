# Intégration des articles de blog — guide du dépôt

**Fichier de référence** : `PostForBlog.md` à la **racine du dépôt** (à côté de `README.md`). Il décrit la structure `blog_content/`, le frontmatter, le rendu Markdown/Next.js, les **scripts**, l’**API FastAPI** et les **variables d’environnement** utiles pour **créer**, **versionner** et **afficher** les posts — afin de **reproduire le même modèle** dans d’autres projets.

Ce document fixe une **stratégie simple et maintenable** : **Markdown + YAML** comme source de vérité, **Contentlayer2** pour le build Next.js, **option** de consommation via **API** (liste, détail, connexes, médias).

---

## Vue d’ensemble architecture

| Couche | Rôle |
|--------|------|
| **`blog_content/`** | Articles `.md` / `.en.md` + dossier **`2026/assets/`** (médias versionnés). |
| **Backend FastAPI** | Parse les mêmes fichiers que le front ; expose **JSON** (posts + fichiers médias). |
| **Frontend Next.js** | **Contentlayer2** lit `blog_content/` au build ; si une URL d’API est définie au build, **priorité à l’API** pour liste, détail et connexes. |
| **`frontend/public/`** | Fichiers statiques (`/posts/…`) ; copie **`blog-assets/2026/`** générée depuis `blog_content/2026/assets/`. |

**Deux façons d’alimenter le blog au build** :

1. **Sans API** (défaut) : `getStaticProps` utilise **`contentlayer/generated`** (`allPosts`).
2. **Avec API** : si `BLOG_API_URL`, `BACKEND_URL` ou `NEXT_PUBLIC_API_URL` pointe vers un backend joignable, le front appelle **`/api/v1/posts`**, **`/api/v1/posts/{slug}`**, **`/api/v1/posts/{slug}/related`** — le Markdown affiché vient alors du champ **`body`** de l’API.

**Médias sous `blog_content/2026/assets/`** :

- **Sur le site Next** : URL **`/blog-assets/2026/...`** après **`npm run assets:sync`** (copie vers `frontend/public/blog-assets/2026/`).
- **Hors Next** (client mobile, autre domaine) : **`GET /api/v1/blog-assets/{chemin}`** avec le même chemin relatif sous `assets/` (ex. `covers/foo.svg`).

---

## 1. Faut-il des fichiers JSON pour le corps des articles ?

**Non, pas comme format principal du contenu.**

| Approche | Rôle recommandé |
|----------|-----------------|
| **Markdown + frontmatter YAML** | **Source de vérité** : métadonnées en tête de fichier, corps en Markdown. C’est ce que le projet utilise déjà. |
| **JSON** | Utile pour **échanges API**, import/export, ou **données tabulaires** (ex. liste de liens générée par un outil), **pas** pour rédiger de longs articles à la main. |
| **HTML seul** | Possible **à l’intérieur** d’un `.md` (blocs HTML) si un cas précis l’exige ; le flux normal reste le Markdown. |

**Pourquoi rester sur le Markdown ?**

- Lisible en revue Git, diffs clairs, pas d’échappement JSON partout.
- Le rendu passe par **react-markdown** (+ **remark-gfm** : tableaux, listes de tâches, etc.).
- Les métadonnées (**titre, date, auteur, tags, image de couverture**, etc.) sont dans le **YAML** du frontmatter.

---

## 2. Structure de fichiers (`blog_content/`)

### 2.1 Emplacement et thèmes (`blog_content/2026/`)

- **Racine des contenus** : `blog_content/`
- **Année** puis **sous-dossier thématique** (organisation actuelle) :
  - `guides/` — démos contenu (images, vidéos)
  - `data/` — data engineering (BigQuery, pipelines)
  - `ml/` — ML / MLOps / Vertex
  - `languages/` — Python, etc.
  - `platform/` — Docker, Flask, SQLAlchemy
- Fichiers : **`nom.md`** (FR) et **`nom.en.md`** (EN) dans le **même** sous-dossier.

### 2.2 Slug public et `slug_override`

- **Par défaut**, le **slug** d’URL est dérivé du chemin : dossiers + nom de fichier (ex. `2026/guides/article.md` → segments reliés par des tirets ; voir `frontend/contentlayer.config.ts` et `backend/app/services/posts_service.py` pour l’alignement exact).
- Si vous **déplacez** un fichier ou changez le chemin, renseignez **`slug_override: "slug-stable"`** dans le YAML pour **ne pas casser** les liens `/blog/[slug]`, le sitemap et l’API.
- **Contentlayer** et le **backend** lisent **`slug_override`** ; le backend accepte aussi la clé **`slug`** dans le frontmatter si vous l’utilisez seule.

### 2.3 Bilingue FR / EN

- Article français : `nom.md`
- Article anglais : `nom.en.md` (même base de nom, suffixe **`.en`**)  
  Le champ calculé **`language`** (`fr` / `en`) est dérivé du nom de fichier (Contentlayer) et reproduit côté API.

### 2.4 Frontmatter (schéma Contentlayer)

Définition : **`frontend/contentlayer.config.ts`** (document type **`Post`**).

| Champ | Obligatoire | Rôle |
|-------|-------------|------|
| `title` | oui | Titre |
| `date` | oui | Date de publication |
| `description` | non | Résumé (SEO, listes) ; défaut chaîne vide côté schéma |
| `image` | non | Couverture ; chemins **`/posts/…`**, **`/blog-assets/2026/…`**, ou **`/logo.svg`** par défaut dans le schéma |
| `tags` | non | Liste de chaînes |
| `category` | non | Catégorie affichée |
| `slug_override` | non | Slug URL **fixe** si le chemin fichier ne doit pas piloter le slug |
| `author` | oui | Objet **`name`**, **`avatar`** (chemins vers fichiers dans `public/`, ex. `/logo-mark.svg`) |

**Champs calculés (Contentlayer, non écrits dans le YAML)** :

- **`slug`** : `slug_override` si présent, sinon chemin aplati avec tirets ; fichier **`.en.md`** → suffixe **`-en`** sur le slug (cohérent avec le backend).
- **`language`** : `en` si le fichier se termine par `.en.md`, sinon `fr`.

Exemple minimal :

```yaml
---
slug_override: "2026-mon-article"
title: "Mon titre"
date: 2026-04-17
description: "Résumé pour SEO et listes."
image: /posts/2026/cover.png
category: Data
tags: [GCP, BigQuery, ML]
author:
  name: Daya SYLLA
  avatar: /logo-mark.svg
---
```

> Omettez `slug_override` si le slug dérivé du chemin vous convient (nouveau contenu).

### 2.5 Médias versionnés (`blog_content/2026/assets/`)

- Arborescence libre sous **`blog_content/2026/assets/`** (ex. `covers/`, `img/`, `videos/`).
- Référence côté site : **`/blog-assets/2026/<sous-chemin/fichier>`** après sync.
- **`frontend/public/blog-assets/`** est en principe **gitignoré** : ne versionner que la source sous `blog_content/`.

---

## 3. Contenu riche : images, vidéos, code, HTML

### 3.1 Images

- **Option A — `public/`** : fichiers sous **`frontend/public/`** (ex. `public/posts/2026/diagramme.png`), URL **`/posts/2026/diagramme.png`**.
- **Option B — `blog_content/…/assets/`** : versionner les médias dans **`blog_content/2026/assets/`** (ex. `assets/covers/mon-article.svg`, `assets/img/photo.png`). Référencer dans le frontmatter et le Markdown avec le préfixe **`/blog-assets/2026/...`** (ex. `image: /blog-assets/2026/covers/mon-article.svg`).
- À chaque **`npm run dev`** / **`npm run build`**, le script **`scripts/sync-blog-assets.sh`** recopie `blog_content/2026/assets/` → **`frontend/public/blog-assets/2026/`** pour que Next serve les fichiers comme statiques. La source de vérité reste sous `blog_content/`.
- Préférer des **chemins absolus** depuis la racine du site (`/...`).

### 3.2 Vidéos

- **Lien** : `[Voir la vidéo](https://www.youtube.com/watch?v=...)`
- **Embed YouTube** : bloc **iframe** avec une URL **`https://www.youtube.com/embed/VIDEO_ID`** (ou `youtube-nocookie.com/embed/...`). Voir § 3.5 pour le filtrage côté app.
- **Fichier local (mp4, webm, …)** : déposer sous `blog_content/2026/assets/videos/`, synchroniser, puis dans le Markdown :

```html
<video src="/blog-assets/2026/videos/demo.mp4" controls playsinline></video>
```

(Seules les URLs commençant par **`/blog-assets/`** sont acceptées pour les balises **`<video>`** côté rendu.)

### 3.3 Code

- Blocs avec fences **\`\`\`lang** (GFM).

### 3.4 HTML ponctuel

- Autorisé dans le corps ; préférer des blocs courts pour la lisibilité Git.

### 3.5 Implémentation actuelle du rendu (Next.js)

- **Composant** : `frontend/src/components/markdown/markdown.tsx`
- **Plugins** : **remark-gfm** ; **rehype-raw** pour interpréter le HTML brut (iframes, `div`, etc.).
- **Sécurité** : seules les iframes dont **`src`** commence par **`https://www.youtube.com/embed/`** ou **`https://www.youtube-nocookie.com/embed/`** sont rendues ; les autres sont ignorées.
- **Typographie** : classes **Tailwind Typography** (`prose`) sur le conteneur de l’article pour titres, listes, paragraphes.
- **Images locales** (`/posts/…`, `/blog-assets/…`) : **`next/image`** ; **GIF animés** et **URLs http(s)** externes : **`<img>`** natif (meilleure compat animation).
- **Couverture article** : logique dédiée dans les composants de page / cartes (GIF ou URL externe peut forcer **`<img>`** au lieu de `next/image` — voir `post-page.tsx`, `post-card.tsx`, `related-posts.tsx`).
- **`<video>`** : uniquement **`src`** sous **`/blog-assets/`** (après sync depuis `blog_content/2026/assets/`).

En production, vérifiez la **CSP** (`frame-src` pour YouTube, `media-src` si vous restreignez les médias).

### 3.6 API : servir les médias sans Next

- **`GET /api/v1/blog-assets/{path}`** : lit un fichier sous **`blog_content/2026/assets/`** (ex. fichier `covers/foo.svg` → `GET {origin}/api/v1/blog-assets/covers/foo.svg`). Le segment d’URL après `blog-assets/` est le **chemin relatif** dans `assets/`.
- **Sécurité chemin** : normalisation, interdiction de `..`, le fichier résolu doit rester sous la racine `assets/`.
- **Extensions autorisées** : `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.avif`, `.bmp`, `.ico`, `.mp4`, `.webm`, `.mov`, `.m4v`, `.ogv` — **415** si extension hors liste ; **404** si fichier absent ou hors base.
- **En-têtes** : `Content-Type` explicite (dont surcharge pour svg, mp4, webm, mov, etc.), `Cache-Control: public, max-age=3600`, `X-Content-Type-Options: nosniff`.
- Utile pour un client qui consomme le Markdown **hors** du site Next tout en gardant les binaires dans le dépôt.

---

## 4. JSON : quand l’utiliser ?

- **Réponses API** (`GET /api/v1/posts`, etc.) : le backend sérialise les posts — pas de `.json` par article à la main.
- **Données annexes** : ex. `frontend/data/glossary.json` — **hors** du corps des articles.
- **Import** : script externe → génération de `.md` + frontmatter.

---

## 5. Workflow de publication

0. **Gabarit** : **`scripts/templates/blog_article.md`** (hors `blog_content/` : pas ingéré par Contentlayer).
1. Créer **`blog_content/2026/<thème>/mon-article.md`** et **`mon-article.en.md`** si bilingue.
2. Remplir le **YAML** (`slug_override` si besoin) puis le corps **Markdown**.
3. Déposer les **assets** soit dans **`frontend/public/posts/YYYY/`** (`/posts/…`), soit dans **`blog_content/2026/assets/`** (`/blog-assets/2026/…` après `npm run assets:sync`).
4. **Build / dev** : **`npm run assets:sync`** (inclus dans **predev** / **prebuild** dans `frontend/package.json`) ; Contentlayer régénère (message *Generated N documents in .contentlayer*) ; `npm run contentlayer` ou `npm run dev`.
5. Vérifier **`/blog`** et **`/blog/[slug]`** (et la version EN si applicable).
6. **Backend optionnel** : même arborescence `blog_content/` ; pour le build Next avec données API, démarrer l’API et définir **`BLOG_API_URL`** / **`BACKEND_URL`** / **`NEXT_PUBLIC_API_URL`**.

---

## 5 bis. Exemples « démo » (`blog_content/2026/`)

| Emplacement | Rôle |
|-------------|------|
| `guides/demo-images-markdown(.en).md` | Couverture, figure locale, image externe (Wikimedia). |
| `guides/demo-video-youtube(.en).md` | Lien YouTube + iframe embed. |
| `guides/streamlit-dashboards(.en).md` | Apps data Python ; image sous `/posts/2026/` ou assets selon le frontmatter. |
| `data/bigquery-optimization(.en).md` | Data engineering avec `slug_override`. |

---

## 6. Référence API (FastAPI) — alignement affichage

**Préfixe JSON** : `/api/v1` (routes dans `backend/app/api/v1/`, montées dans `backend/app/main.py`).

**Découverte** :

| Méthode | Chemin | Description |
|---------|--------|-------------|
| GET | **`/api`** | JSON minimal : liens logiques vers `docs`, `healthz`, `metrics`, `v1`, `posts`, indices `posts_hint`, `related_hint`, `blog_assets_hint`. |
| GET | **`/docs`** | Swagger UI (FastAPI). |
| GET | **`/redoc`** | ReDoc. |
| GET | **`/healthz`** | `{"status":"ok"}` — sonde liveness. |
| GET | **`/metrics`** | Métriques **Prometheus** (`text/plain` format exposition). |

**Pages HTML optionnelles** (même processus backend, port typique 8080) : **`/`** (landing), **`/monitoring`**, redirection **`/ui`** → **`/`** — hors schéma OpenAPI minimal ; utiles si vous réutilisez le même package `app`.

### 6.1 Routes `/api/v1`

| Méthode | Chemin | Réponse | Notes |
|---------|--------|---------|------|
| GET | **`/api/v1/status`** | `service`, `version`, `status` | Rate limit dédié. |
| GET | **`/api/v1/rate-limit`** | Objet : `enabled`, `storage`, `limits` par route | Récap des plafonds configurés (slowapi, stockage mémoire). |
| GET | **`/api/v1/posts`** | `PostSummary[]` | Query : **`language`** (`fr`/`en`), **`category`**, **`tag`**, **`q`** (recherche titre/description/tags/catégorie), **`limit`** (1–100, défaut 100), **`offset`**. En-tête réponse **`X-Total-Count`** : total après filtres, avant pagination. **`Cache-Control: public, max-age=60`**. |
| GET | **`/api/v1/posts/{slug}`** | **`PostDetail`** (= summary + **`body`** Markdown sans frontmatter) | **404** si inconnu. **`Cache-Control: public, max-age=120`**. |
| GET | **`/api/v1/posts/{slug}/related`** | `PostSummary[]` | Query **`limit`** (1–12, défaut 3). **404** si le slug principal n’existe pas. Logique : même langue, tags, repli. |
| GET | **`/api/v1/blog-assets/{path:path}`** | Fichier binaire / texte | Voir § 3.6. **400** chemin invalide, **404** absent / traversal, **415** extension non supportée. |

**Ordre des routes** : la route **`…/related`** est enregistrée **avant** **`…/{slug}`** pour que le segment `related` ne soit pas capturé comme slug.

### 6.2 Schémas JSON (Pydantic)

Fichier : **`backend/app/schemas/post.py`**.

- **`Author`** : `name`, `avatar` (défauts côté API si absents du YAML).
- **`PostSummary`** : `slug`, `title`, `description`, `date` (ISO date), `language`, `image`, `author`, `tags`, `category`, **`reading_minutes`** (entier ≥ 1), **`alternate_slug`**, **`alternate_language`** (lien vers la version sœur FR/EN).
- **`PostDetail`** : **`PostSummary` + `body`** (chaîne Markdown, corps seul).

Le backend calcule **`reading_minutes`**, **`alternate_*`** et normalise les champs à partir des fichiers parsés (voir **`backend/app/services/posts_service.py`**). **Cache mémoire** des posts parsés : TTL **`BLOG_POSTS_CACHE_TTL_SECONDS`** (défaut 45 s).

### 6.3 Rate limiting & CORS

- Middleware **slowapi** ; en-têtes exposés CORS incluent **`X-RateLimit-Limit`**, **`X-RateLimit-Remaining`**, **`X-RateLimit-Reset`**, **`Retry-After`**.
- Plafonds configurables via variables d’environnement (voir § 7).
- **`CORS_ORIGINS`** (ou équivalent dans `Settings`) : liste d’origines autorisées pour le navigateur (ex. `http://localhost:3000`).

### 6.4 Consommation côté Next (build / ISR)

Fichier : **`frontend/src/lib/blog-api.ts`**.

- **`getServerBlogApiBaseUrl()`** : première valeur non vide parmi **`BLOG_API_URL`**, **`BACKEND_URL`**, **`NEXT_PUBLIC_API_URL`** (slash final retiré).
- Si défini et les `fetch` réussissent :
  - **`fetchBlogSummariesFromApi()`** → `GET {base}/api/v1/posts` → alimente **`/blog`**, **`/`** (articles mis en avant), et **`getStaticPaths`** pour **`/blog/[slug]`**.
  - **`fetchBlogPostFromApi(slug)`** → `GET …/posts/{slug}`.
  - **`fetchBlogRelatedFromApi(slug, limit)`** → `GET …/posts/{slug}/related?limit=…` ; **404** → liste vide ; erreur réseau → **`null`** (repli possible sur calcul local).

**Revalidation** : les pages **`/`** et **`/blog`** déclarent **`revalidate = 60`** (ISR).

---

## 7. Variables d’environnement (reproduction)

### 7.1 Backend (`backend/app/core/config.py`, `.env` à la racine du package ou cwd)

| Variable | Rôle |
|----------|------|
| **`BLOG_CONTENT_DIR`** | Chemin absolu ou relatif vers la racine **`blog_content`** (défaut : parent du package → `blog_content` à la racine du dépôt). |
| **`BLOG_POSTS_CACHE_TTL_SECONDS`** | TTL du cache mémoire des posts parsés (float, défaut **45**). |
| **`CORS_ORIGINS`** | Origines séparées par virgules. |
| **`RATE_LIMIT_ENABLED`** | Activer / désactiver slowapi (bool). |
| **`RATE_LIMIT_V1_STATUS`** | Ex. `200/minute`. |
| **`RATE_LIMIT_V1_POSTS_LIST`** | Ex. `90/minute`. |
| **`RATE_LIMIT_V1_POSTS_DETAIL`** | Ex. `120/minute`. |
| **`RATE_LIMIT_V1_POSTS_RELATED`** | Ex. `90/minute`. |
| **`RATE_LIMIT_V1_BLOG_ASSETS`** | Ex. `200/minute`. |
| **`RATE_LIMIT_V1_RATE_INFO`** | Ex. `30/minute`. |
| **`REDIS_URL`** | Réservé / note README pour limites distribuées (hors implémentation actuelle). |

### 7.2 Frontend (Next.js)

| Variable | Rôle |
|----------|------|
| **`BLOG_API_URL`** / **`BACKEND_URL`** / **`NEXT_PUBLIC_API_URL`** | Base URL du backend pour **`getStaticProps`** / **`getStaticPaths`** (priorité dans cet ordre côté code). |
| **`NEXT_PUBLIC_SITE_URL`** | Base du site pour le **sitemap** (`frontend/src/pages/api/sitemap.ts`, défaut `http://localhost:3000`). |

---

## 8. Frontend Next.js — fichiers utiles

| Fichier / dossier | Rôle |
|-------------------|------|
| **`frontend/contentlayer.config.ts`** | Schéma **`Post`**, `contentDirPath: '../blog_content'`, champs calculés `slug` / `language`. |
| **`frontend/src/pages/blog/index.tsx`** | Liste blog ; API puis repli Contentlayer. |
| **`frontend/src/pages/blog/[slug].tsx`** | Détail ; `getStaticPaths` ; API puis repli **`allPosts`**. |
| **`frontend/src/pages/index.tsx`** | Accueil ; articles mis en avant (même priorité API). |
| **`frontend/src/lib/blog-api.ts`** | URL base + fetch posts / related. |
| **`frontend/src/lib/blog-contentlayer.ts`** | Mappers Contentlayer → **`BlogPost`** / **`BlogListItem`**. |
| **`frontend/src/types/blog.ts`** | Types **`BlogPost`**, **`BlogListItem`**, **`BlogLocale`**. |
| **`frontend/src/components/markdown/markdown.tsx`** | Rendu Markdown sécurisé. |
| **`frontend/next.config.ts`** | **withContentlayer**, réécriture **`/sitemap.xml`** → **`/api/sitemap`**, en-têtes de sécurité ; **`output: 'standalone'`** si **`NEXT_DOCKER_BUILD=1`** (image Docker). Pas de hook **Webpack** par défaut (compatibilité **Turbopack** en dev). |
| **`frontend/package.json`** | **`predev`** / **`prebuild`** : **`i18n:compile`** puis **`assets:sync`** ; **`dev`** : Turbopack ; **`contentlayer`** : build documents. |

**Sitemap** : route API **`/api/sitemap`** ; URLs des posts **`{SITE_URL}/blog/{slug}`** — généré à partir de **`contentlayer/generated`** (pas dynamiquement depuis l’API au moment de la rédaction de ce guide ; à étendre si vous ne versionnez plus les `.md` côté front).

**i18n UI** (hors corps des articles) : **`scripts/compile-translations.sh`**, fichiers **`frontend/src/blueprints/`**, **`frontend/src/translations/`** — voir **`README.md`** racine.

**Dépannage** (`ENOENT` sous **`.next`**, conflit après build **standalone**) : **`docs/TROUBLESHOOTING.md`** ; script **`scripts/dev/run-frontend.sh`** nettoie **`.next`** si **`.next/standalone`** est présent.

---

## 9. Scripts du dépôt (création & affichage)

| Script | Rôle |
|--------|------|
| **`scripts/sync-blog-assets.sh`** | `blog_content/2026/assets/` → `frontend/public/blog-assets/2026/`. |
| **`scripts/compile-translations.sh`** | Validation / compilation des locales. |
| **`scripts/templates/blog_article.md`** | Gabarit d’article (ne pas placer sous `blog_content/`). |
| **`scripts/dev/run-frontend.sh`** / **`run-backend.sh`** | Lancement dev documenté dans **`README.md`**. |

---

## 10. Développement frontend (rappel pratique)

- **Par défaut** : `npm run dev` → **`next dev --turbopack`**.
- **Mode Webpack** : `npm run dev:webpack` — `next.config.ts` **désactive le cache Webpack en dev** uniquement dans ce mode.
- **Cache corrompu** : `CLEAN_NEXT=1 ./scripts/dev/run-frontend.sh` ou `npm run dev:fresh` (voir **`README.md`**).

---

## 11. Évolutions possibles

| Besoin | Piste |
|--------|--------|
| Composants React dans le corps | **MDX** + adaptation Contentlayer / build. |
| CMS headless | Sync vers `blog_content/` ou API uniquement. |
| Médias lourds | Objet (GCS, S3) + URLs absolues dans le Markdown. |
| Sitemap 100 % aligné API | Générer `/api/sitemap` à partir d’un fetch `GET /api/v1/posts` au build. |

---

## 12. Reproduire ce modèle dans un autre projet (checklist)

1. **Arborescence** : dossier **`blog_content/`** avec la même convention **`.md` / `.en.md`** si bilingue.
2. **Frontmatter** : répliquer les champs nécessaires + **`slug_override`** pour URLs stables.
3. **Next** : Contentlayer (ou équivalent) pointant sur **`blog_content`** ; pages **`/blog`**, **`/blog/[slug]`** ; composant Markdown avec **remark-gfm**, **rehype-raw**, règles **iframe** / **video** / **GIF**.
4. **Assets versionnés** : dossier assets + script de **copie vers `public/`** avant `next build` ; URLs stables **`/blog-assets/...`**.
5. **Backend optionnel** : parser YAML + Markdown (même règles de slug) ; exposer **liste**, **détail**, **related** ; endpoint **fichiers** sous assets avec **whitelist d’extensions** et **chemin canonicalisé**.
6. **Sécurité** : CORS, rate limit, pas de `..` dans les chemins médias, CSP en production.
7. **Observabilité** : **`/healthz`**, **`/metrics`** si vous exposez Prometheus.
8. **Documentation** : maintenir une page unique (comme ce fichier) listant **endpoints**, **env**, **scripts** et **priorité API vs fichiers**.

---

## 13. Synthèse

- **Structure** : Markdown + YAML dans **`blog_content/YYYY/<thème>/`**, paires **`.md` / `.en.md`**, assets **`public/`** et/ou **`blog_content/2026/assets/`** + **`/blog-assets/2026/…`** après sync.
- **URLs stables** : **`slug_override`** (ou **`slug`**) aligné **Contentlayer** / **FastAPI**.
- **Médias** : images locales, **GIF** / externe en **`<img>`** si besoin ; **vidéo** locale uniquement sous **`/blog-assets/`** ; **YouTube** filtré dans les iframes ; **API blog-assets** pour clients hors Next.
- **Données** : une source Markdown ; **JSON** via **`/api/v1/posts`**, **`/api/v1/posts/{slug}`**, **`/api/v1/posts/{slug}/related`**, **`/api/v1/blog-assets/...`** ; détails supplémentaires dans **`backend/README.md`** et **`README.md`** racine.
