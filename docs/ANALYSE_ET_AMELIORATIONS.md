# Analyse du dépôt et propositions d’améliorations

Document généré après analyse complète du repository **smdlabtech.github.io** (portfolio & blog Jekyll + API Flask).

---

## 1. Résumé du projet

| Élément | Détail |
|--------|--------|
| **Frontend** | Jekyll (app/), déployé sur GitHub Pages |
| **Backend** | Flask (app/src/), déployable sur Cloud Run |
| **CI/CD** | GitHub Actions (ci.yml, deploy.yml, jekyll-pages.yml) |
| **Monitoring** | Prometheus, Grafana, Loki, Alertmanager |
| **Tests** | pytest (tests/ à la racine), unit + intégration |

---

## 2. Points forts actuels

- **Architecture claire** : séparation Jekyll (app/) et Flask (app/src/), factory `create_app`, blueprints.
- **CI/CD avancé** : pipeline unifié (tests, lint, build, déploiement), sécurité (Trivy, TruffleHog), déploiement Cloud Run avec health check et rollback.
- **Observabilité** : stack monitoring (Prometheus, Grafana, Loki), métriques Flask, health checks.
- **Documentation** : README, CONTRIBUTING, STRUCTURE, IMPROVEMENTS, AMELIORATIONS_REPO.
- **Qualité de code** : pre-commit (black, flake8, isort, yamllint, detect-secrets).
- **Améliorations déjà prévues** : bundle CSS/JS, cache Redis, modèles enrichis, PWA (cf. docs/IMPROVEMENTS.md).

---

## 3. Problèmes identifiés et corrections proposées

### 3.1 CI/CD – Chemins des tests (critique)

**Problème** : Dans `.github/workflows/ci.yml`, le job « Tests & Lint » fait :

```yaml
cd app
python -m pytest tests/ -v --cov=src ...
```

Les tests sont dans **`tests/` à la racine du repo**, pas dans `app/tests/`. Depuis `app/`, le chemin `tests/` pointe vers `app/tests/` qui n’existe pas → les tests ne sont pas exécutés en CI.

**Correction proposée** : Exécuter pytest depuis la racine avec `PYTHONPATH=app` :

```yaml
- name: Run tests
  run: |
    echo "🧪 Running pytest..."
    PYTHONPATH=app python -m pytest tests/ -v --cov=app/src --cov-report=xml --cov-report=html --cov-config=app/pyproject.toml 2>/dev/null || PYTHONPATH=app python -m pytest tests/ -v --cov=src --cov-report=xml --cov-report=html
  env:
    FLASK_ENV: testing
```

Ou plus simplement (recommandé) :

```yaml
- name: Run tests
  run: |
    export PYTHONPATH=app
    python -m pytest tests/ -v --cov=src --cov-report=xml --cov-report=html
  env:
    FLASK_ENV: testing
```

Et **ne pas** faire `cd app` avant cette étape (ou alors utiliser `python -m pytest ../tests/` depuis `app/` et adapter les chemins de couverture).

---

### 3.2 Dépendance Python manquante

**Problème** : `app/src/database/models.py` utilise `from slugify import slugify` (python-slugify), mais **`requirements.txt`** ne liste pas ce package → erreur au runtime en environnement propre.

**Correction** : Ajouter dans `app/requirements.txt` :

```
python-slugify==8.0.1
```

---

### 3.3 Fixture pytest `db` manquante

**Problème** : Les tests (ex. `tests/unit/test_services.py`) utilisent une fixture `db` (`def test_get_all_articles_empty(self, app, db)`), alors que `tests/conftest.py` ne définit que `app`, `client`, `runner`. Sans fixture `db`, les tests qui l’utilisent peuvent échouer ou dépendre d’un comportement implicite.

**Correction** : Dans `tests/conftest.py`, exposer explicitement `db` :

```python
@pytest.fixture
def db(app):
    """Expose db for tests that need it."""
    from src.database.extensions import db as _db
    with app.app_context():
        yield _db
```

S’assurer que les tests qui utilisent `db` reçoivent bien cette fixture (et que `app` est chargé avant).

---

### 3.4 Duplication / incohérence des workflows de déploiement

**Problème** :  
- **ci.yml** : build Docker → push vers **GHCR** (`ghcr.io/${{ github.repository }}`), puis déploiement Cloud Run avec cette image.  
- **deploy.yml** : build Docker → push vers **Artifact Registry** (`$REGION-docker.pkg.dev/...`), déploiement Cloud Run avec rollback et smoke tests.

Deux cibles (GHCR vs AR) et deux façons de déployer le backend peuvent prêter à confusion et à erreurs (mauvais secret, mauvaise région, etc.).

**Recommandation** :  
- Choisir **une** cible d’images (GHCR ou Artifact Registry) et **un** workflow principal de déploiement backend (par ex. garder deploy.yml pour Cloud Run avec AR, et faire que ci.yml ne déploie pas le backend, ou qu’il appelle les mêmes étapes).  
- Documenter dans le README ou dans `docs/` : « Le backend est déployé via deploy.yml sur Artifact Registry + Cloud Run » (ou l’inverse).

---

### 3.5 Erreur dans deploy.yml (build Docker)

**Problème** : Dans `deploy.yml`, l’étape « Build Docker image with cache » contient **deux fois** la clé `platforms: linux/amd64` (une fois après `tags:` et une fois après `cache-to:`), ce qui peut provoquer une erreur YAML ou un comportement inattendu.

**Correction** : Ne garder qu’une seule occurrence de `platforms: linux/amd64` dans ce step.

---

### 3.6 Layout Jekyll « optimisé » non utilisé

**Problème** : `docs/IMPROVEMENTS.md` décrit un layout `base-optimized` qui charge un seul CSS et un seul JS (bundles), mais les layouts réels (`base.html`, `page.html`, etc.) utilisent encore `layout: base`. Les gains décrits (moins de requêtes, meilleur LCP) ne s’appliquent donc pas tant que les pages n’utilisent pas le layout optimisé.

**Recommandation** :  
- Migrer progressivement les layouts/pages vers `layout: base-optimized` (ou faire hériter `base.html` de `base-optimized` si vous préférez un seul point de changement).  
- Après validation, archiver ou supprimer les anciens CSS/JS non utilisés pour éviter la confusion.

---

### 3.7 .gitignore – Dossiers à la racine

**Problème** : En tête de `.gitignore` on trouve notamment :

- `/test` (singulier) → le dossier **`tests/`** (pluriel) n’est pas ignoré, ce qui est correct.  
- `/scripts` → tout dossier **`scripts/`** à la racine est ignoré. Si vous aviez des scripts à la racine à versionner, ils ne le seraient pas. Actuellement les scripts utiles sont dans `app/scripts/`, donc pas de conflit, mais à noter.  
- `# /docs - Garder la documentation` → la ligne est en commentaire, donc **`docs/`** n’est pas ignoré, ce qui est voulu.

**Recommandation** :  
- Vérifier que vous n’avez pas besoin de versionner un `scripts/` à la racine. Sinon, retirer `/scripts` du `.gitignore` ou le remplacer par des chemins plus ciblés.  
- Laisser `docs/` non ignoré et continuer à documenter dans `docs/`.

---

### 3.8 README – Structure « src/ » trompeuse

**Problème** : Le README indique une structure avec **`src/`** à la racine pour Flask. En réalité, le backend Flask est sous **`app/src/`**. Un nouveau contributeur pourrait chercher `src/` à la racine.

**Correction** : Mettre à jour le schéma dans le README pour refléter la structure réelle, par exemple :

```
smdlabtech.github.io/
├── app/                    # Application (Jekyll + Flask)
│   ├── _config.yml         # Configuration Jekyll
│   ├── _includes/          # Templates Jekyll
│   ├── _layouts/
│   ├── _posts/
│   ├── assets/             # CSS, JS, images (Jekyll)
│   ├── src/                # Backend Flask (API, services, modèles)
│   ├── index.html
│   ├── run.py              # Point d’entrée Flask
│   └── requirements.txt
├── tests/                  # Tests pytest (racine)
├── docs/
├── monitoring/
└── .github/workflows/
```

---

### 3.9 Fichiers de configuration d’environnement

**Problème** : Plusieurs fichiers d’exemple : `.env.production.example`, `env.example`, `env.production.example` (à la racine et peut-être ailleurs). Risque de duplication et d’oubli de mise à jour.

**Recommandation** :  
- Garder **un** fichier d’exemple à la racine (par ex. `env.example`) comme référence unique, avec des commentaires pour dev vs prod.  
- Documenter dans le README ou CONTRIBUTING : « Copier `env.example` vers `.env` et adapter les valeurs. »

---

### 3.10 Sécurité et bonnes pratiques

- **Secrets** : Les workflows utilisent `GCP_SA_KEY`, `SLACK_WEBHOOK_URL`, etc. S’assurer qu’ils sont bien configurés comme secrets/variables d’organisation ou de repo, et que le README ne les mentionne pas avec de vraies valeurs.  
- **Dépendances** : Lancer régulièrement `pip audit` ou `safety check` (déjà dans requirements-dev.txt) et traiter les vulnérabilités.  
- **Pre-commit** : La ligne `files: ^app/src/.*\.py$` ne couvre pas les tests à la racine. Pour formater/linter aussi les tests, ajouter par exemple `^tests/.*\.py$` dans les hooks black/flake8/isort (ou un hook dédié pour `tests/`).

---

## 4. Améliorations optionnelles (ordre de priorité)

1. **Activer le layout optimisé** (base-optimized) et mesurer (Lighthouse, Core Web Vitals).  
2. **Unifier le déploiement backend** (une seule cible d’images, un workflow principal) et documenter.  
3. **Corriger la CI** pour exécuter vraiment les tests (PYTHONPATH + chemins).  
4. **Ajouter `python-slugify`** et la fixture `db` pour des tests stables.  
5. **Étendre pre-commit** aux fichiers sous `tests/`.  
6. **Mettre à jour le README** (structure `app/` + `app/src/`, instructions env).  
7. **Nettoyer deploy.yml** (une seule occurrence de `platforms`).  
8. **Vérifier .gitignore** (scripts/docs) selon votre usage réel.

---

## 5. Synthèse des actions concrètes

| Priorité | Action |
|----------|--------|
| Haute | Corriger le job « Run tests » dans ci.yml (PYTHONPATH + chemin `tests/`). |
| Haute | Ajouter `python-slugify` dans `app/requirements.txt`. |
| Haute | Ajouter la fixture `db` dans `tests/conftest.py` si les tests l’utilisent. |
| Moyenne | Unifier et documenter le déploiement backend (GHCR vs AR, un workflow de référence). |
| Moyenne | Supprimer la duplication `platforms` dans deploy.yml. |
| Moyenne | Migrer les layouts Jekyll vers `base-optimized` (ou équivalent). |
| Basse | Aligner README et docs sur la structure réelle (`app/`, `app/src/`). |
| Basse | Centraliser les exemples d’env et documenter leur usage. |
| Basse | Étendre pre-commit à `tests/`. |

---

*Document généré pour le dépôt smdlabtech.github.io. Vous pouvez copier les extraits de code dans les fichiers concernés et adapter les noms de chemins ou de secrets selon votre configuration.*
