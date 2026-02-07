# Nettoyage et réorganisation du dépôt (fév. 2025)

Résumé des changements effectués pour un repo plus propre et mieux structuré.

---

## Racine du dépôt

- **Env** : Un seul fichier de référence `env.example` (dev + prod documentés). Suppression de `.env.production.example` (doublon).
- **Docs** : `AMELIORATIONS_REPO.md` et `inv_env_var_check.md` déplacés dans `docs/` (archive + ENV_VARIABLES.md).
- **Structure** : README et docs/STRUCTURE.md alignés sur la vraie arborescence (`app/`, `app/src/`, `tests/` à la racine).

---

## app/

### Layout et assets

- **base.html** : ne contient plus la longue liste CSS/JS ; il délègue à `base-optimized`. Toutes les pages avec `layout: base` utilisent désormais **main.bundle.css** et **main.bundle.js** uniquement.
- **Anciens CSS/JS** : 95 fichiers CSS et 56 JS déplacés dans **app/_archive/assets/** (exclus du build via `exclude: [_archive]` dans `_config.yml`). Réduction forte du nombre de requêtes HTTP en prod.
- **Footer** : suppression des scripts `footer-enhanced.js` et `theme-toggle.js` dans l’include (gérés par le bundle).

### Fichiers supprimés ou déplacés

- **app/__init__.py** : supprimé (redondant avec `run.py`).
- **app/ANALYSE_STRUCTURE.md**, **NETTOYAGE_COMPLET.md**, **PROBLEMES_Jekyll.md** : déplacés dans `docs/archive/`.
- **app/README.md** : réécrit pour pointer vers la racine et décrire brièvement Jekyll + Flask.

### Config Jekyll

- **exclude** : ajout de `_archive` ; suppression des entrées pour les trois .md déplacés.

---

## Script test-local.sh

- **pytest** : si le venv est activé et que `pytest` n’est pas installé, le script installe automatiquement `requirements-dev.txt` (contenant pytest) avant de lancer les tests.
- **Instructions** : mention de `requirements-dev.txt` pour les tests.

---

## Documentation

- **docs/archive/** : AMELIORATIONS_REPO, NETTOYAGE_COMPLET, PROBLEMES_Jekyll + README expliquant l’archive.
- **docs/ENV_VARIABLES.md** : synthèse des variables d’environnement (remplace inv_env_var_check.md).
- **docs/CONTRIBUTING.md** : commandes de test mises à jour (PYTHONPATH=app, requirements-dev).
- **docs/STRUCTURE.md** : structure à jour (app/, app/src/, _archive).

---

## À faire de ton côté

1. **Première fois (tests)** : `cd app && python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt -r requirements-dev.txt` puis à la racine : `./app/scripts/test-local.sh`.
2. **Jekyll** : `cd app && bundle install && bundle exec jekyll serve` pour vérifier le site en local.
3. **Env** : copier `env.example` en `.env` si besoin (voir docs/ENV_VARIABLES.md).

---

*Nettoyage effectué le 07/02/2025.*
