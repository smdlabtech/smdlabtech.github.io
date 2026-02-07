# Idées d'améliorations – tout le repo

Pistes d’évolution par thème. Certaines sont déjà partiellement en place.

---

## Sécurité

| Idée | Détail | Priorité |
|------|--------|----------|
| **CORS en production** | Limiter `origins` aux domaines autorisés (site Jekyll + éventuel front séparé) au lieu de `*`. Utiliser `CORS_ORIGINS` depuis la config. | ✅ Fait (voir `app/src/__init__.py`) |
| **Secrets** | Vérifier qu’aucun secret n’est en dur ; tout via env / Secret Manager. | À auditer |
| **Rate limiting API** | Flask-Limiter est configuré ; vérifier les limites par route (ex. `/api/v1/articles/` vs `/admin`). | Moyenne |
| **CSP** | Affiner la Content-Security-Policy (réduire `unsafe-inline` / `unsafe-eval` si possible). | Basse |
| **Dépendances** | Lancer régulièrement `pip audit` ou `safety check` (déjà dans requirements-dev). | À automatiser en CI |

---

## Performance & SEO (Jekyll)

| Idée | Détail | Priorité |
|------|--------|----------|
| **robots.txt** | Ajouter un `robots.txt` pour GitHub Pages (sitemap, règles crawl). | ✅ Fait |
| **Sitemap** | `jekyll-sitemap` est déjà dans le Gemfile ; vérifier que `sitemap.xml` est bien généré et référencé. | Vérifier |
| **Meta description** | S’assurer que chaque page/post a une `description` ou `share-description` pour le SEO. | Moyenne |
| **Images** | Lazy loading sur les images (attribut `loading="lazy"`), et si possible WebP + dimensions. | Moyenne |
| **Core Web Vitals** | Après passage aux bundles, mesurer LCP / FID / CLS (Lighthouse) et corriger si besoin. | Basse |

---

## Accessibilité (a11y)

| Idée | Détail | Priorité |
|------|--------|----------|
| **Contraste** | Vérifier le ratio de contraste (WCAG AA) sur les textes et boutons (thème clair/sombre). | Moyenne |
| **Focus visible** | S’assurer que la navigation au clavier affiche un focus visible sur les liens/boutons. | Moyenne |
| **Labels** | Vérifier que les formulaires (newsletter, contact) ont des `<label>` ou `aria-label`. | Moyenne |
| **Skip link** | Le lien “Aller au contenu principal” est déjà présent dans le layout ; vérifier qu’il reste visible au focus. | Vérifier |

---

## API Flask

| Idée | Détail | Priorité |
|------|--------|----------|
| **Versioning** | API déjà en `/api/v1/` ; documenter la politique (support v1, future v2). | Basse |
| **Pagination** | Les articles ont `page` et `per_page` ; ajouter `total` ou `total_pages` dans la réponse pour faciliter les clients. | Moyenne |
| **Cache** | Utiliser le cache Redis sur les endpoints GET les plus lus (ex. liste articles) avec `@cached`. | Moyenne |
| **OpenAPI / Swagger** | Exposer une spec OpenAPI (flask-restx ou flasgger) pour documenter l’API. | Basse |
| **Validation** | Valider les paramètres (page, per_page) et renvoyer 400 avec message clair si invalides. | Moyenne |

---

## Tests

| Idée | Détail | Priorité |
|------|--------|----------|
| **Pre-commit sur tests/** | Étendre black / flake8 / isort aux fichiers sous `tests/`. | ✅ Fait |
| **Couverture** | Définir un seuil minimal de couverture (ex. 80 %) et le faire appliquer en CI. | Moyenne |
| **Tests E2E** | Pour les parcours critiques (ex. formulaire contact, newsletter), envisager Playwright ou Cypress. | Basse |
| **Tests de charge** | Optionnel : script locust/k6 sur `/health` et `/api/v1/articles/` pour repérer les régressions. | Basse |

---

## CI/CD & DevOps

| Idée | Détail | Priorité |
|------|--------|----------|
| **Un seul workflow backend** | Éviter deux façons de déployer (GHCR vs Artifact Registry) ; documenter le flux officiel. | Voir ANALYSE_ET_AMELIORATIONS.md |
| **Staging** | Branche ou environnement de staging pour tester avant prod (optionnel). | Basse |
| **Dépendances** | En CI, lancer `pip audit` ou `safety check` et faire échouer le build si critique. | Moyenne |
| **Cache Bundler** | Utiliser `bundler-cache: true` dans les workflows pour accélérer les jobs Jekyll. | Déjà le cas |

---

## Documentation & DX

| Idée | Détail | Priorité |
|------|--------|----------|
| **README** | Structure et “tester avant prod” déjà à jour. Garder une section “Variables d’env” qui pointe vers `docs/ENV_VARIABLES.md`. | Fait |
| **Changelog** | Fichier `CHANGELOG.md` à la racine (ou dans docs) pour les versions / releases. | Basse |
| **ADR** | Pour les choix d’architecture importants, optionnel : dossiers “Architecture Decision Records” dans docs. | Basse |
| **Commentaires** | Dans les endpoints API, docstrings + types pour faciliter la génération de doc (Sphinx/OpenAPI). | Basse |

---

## Jekyll & contenu

| Idée | Détail | Priorité |
|------|--------|----------|
| **i18n** | Si multilingue (fr/en), centraliser les chaînes dans `data/ui-text.yml` et les utiliser partout. | Déjà partiellement en place |
| **RSS** | Vérifier que `feed.xml` et le lien RSS dans le footer fonctionnent correctement. | Vérifier |
| **Commentaires** | Staticman / Giscus / Utterances : documenter dans CONTRIBUTING ou README quelle solution est utilisée et comment la configurer. | Basse |
| **Newsletter** | Si formulaire PHP ou autre : documenter le flux (backend, stockage) ou migrer vers une API Flask. | Moyenne |

---

## Docker & déploiement

| Idée | Détail | Priorité |
|------|--------|----------|
| **Réduire l’image** | Exclure `_archive`, `_posts` (si non utilisés par Flask), et gros fichiers inutiles dans l’image. | ✅ _archive ajouté au .dockerignore |
| **Multi-stage** | Déjà en place ; vérifier que le stage final ne contient pas de dev dependencies. | OK |
| **Healthcheck** | Déjà présent dans le Dockerfile ; s’aligner avec le endpoint `/health` (déjà le cas). | OK |

---

## Résumé des actions déjà faites dans ce tour

- **CORS** : en production, utilisation de `CORS_ORIGINS` (variable d’env) si défini ; sinon par défaut uniquement `https://smdlabtech.github.io`. En dev/test : `*`.
- **Pre-commit** : extension de black / flake8 / isort aux fichiers sous `tests/`.
- **robots.txt** : ajout dans `app/` pour Jekyll (sitemap + Allow: /).
- **.dockerignore** : ajout de `_archive/` pour alléger l’image Docker.

---

*Document vivant : à mettre à jour au fil des décisions et des implémentations.*
