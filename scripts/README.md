## Scripts — organisation prod-ready

Arborescence cible et conventions pour un outillage shell maintenable.

### Catégories

- `scripts/dev/` : run local, setup, bootstrap.
- `scripts/quality/` : tests, lint, checks qualité.
- `scripts/build/` : build artifacts (ex: Jekyll).
- `scripts/deployment/` : scripts de déploiement (si externalisés des workflows).
- `scripts/ci/` : helpers dédiés CI.
- `scripts/ops/` : healthchecks, diagnostics, maintenance.
- `scripts/i18n/` : validation + compilation des traductions.
- `scripts/lib/` : fonctions partagées (`common.sh`, `logging.sh`, `require.sh`).
- `scripts/misc/` : utilitaires ponctuels.

### Conventions

- Bash strict mode obligatoire : `set -euo pipefail`.
- Chaque script expose `--help` si pertinent.
- Logging homogène via `scripts/lib/logging.sh`.
- Dépendances shell validées via `scripts/lib/require.sh`.
- Les scripts historiques (anciens chemins) restent supportés via wrappers de compatibilité.

### Commandes utiles

| Objectif | Commande |
|----------|----------|
| Backend FastAPI | `./scripts/dev/run-backend.sh` |
| Frontend Flask | `./scripts/dev/run-frontend.sh` |
| Full stack local | `./scripts/dev/run-all.sh` |
| Tests | `./scripts/quality/run_tests.sh` |
| Validation i18n (HTML keys) | `./scripts/i18n/validate_translations.sh` |
| Compilation i18n + validation | `./scripts/i18n/compile-translations.sh` |
| Healthcheck local | `./scripts/ops/healthcheck.sh` |
| Inventaire docs Markdown | `python3 scripts/misc/generate_markdown_inventory.py --readme-mode compact` |
