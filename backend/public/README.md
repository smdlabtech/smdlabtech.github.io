# Contenu public (`app/public/`)

Dossiers **versionnés** consommés par l’application (chemins par défaut via `PORTFOLIO_*` dans `.env`).

| Dossier | Usage |
|---------|--------|
| **`blog_content/`** | Fichiers `.md` / `.en.md` pour articles ; import possible via `python core/import_blog_articles.py`. |
| **`cv/`** | PDF téléchargeables (ex. route CV) ; voir `cv/README.md`. |
| **`assets/`** | Fichiers statiques publics génériques (ex. placeholders). |

En **conteneur** : ces chemins sont copiés sous `/app/public/` (voir `Dockerfile`).
