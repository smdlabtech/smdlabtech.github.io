# 📁 Structure du Repository

## Vue d'ensemble

Ce repository contient une plateforme complète combinant :
- **Frontend Jekyll** : Site statique déployé sur GitHub Pages
- **Backend Flask** : API REST pour les fonctionnalités dynamiques
- **CI/CD** : Automatisation avec GitHub Actions
- **Monitoring** : Stack d'observabilité (Prometheus, Grafana, Loki)

## Structure Détaillée

### `/app/` – Jekyll (frontend) + Flask (backend)

```
app/
├── _config.yml              # Configuration Jekyll
├── _layouts/                # base.html → base-optimized (bundles)
├── _includes/               # nav-databird, footer-databird, etc.
├── _posts/                  # Articles de blog
├── assets/                  # main.bundle.css, main.bundle.js (+ img)
├── data/                    # articles.yml, navigation.yml, projects.yml
├── src/                     # Backend Flask
│   ├── api/v1/             # Endpoints API
│   ├── routes/             # main, blog, admin
│   ├── services/           # blog_service, cache_service, etc.
│   ├── database/           # models, extensions
│   ├── config/             # base, development, production, testing
│   └── templates/          # Templates Flask
├── scripts/                 # test-local.sh, generate_articles_yml.py
├── run.py                   # Point d'entrée Flask
├── requirements.txt
└── _archive/                # Anciens CSS/JS (exclus du build)
```

### `/.github/workflows/` - CI/CD

```
.github/workflows/
├── jekyll-pages.yml        # Déploiement Jekyll sur GitHub Pages
└── deploy.yml              # Déploiement Flask (si nécessaire)
```

### `/scripts/` - Scripts Utilitaires

```
scripts/
├── setup_jekyll.sh         # Installation Jekyll
├── launch_jekyll.sh        # Lancement serveur Jekyll
├── setup_db.py             # Initialisation base de données
└── ...
```

### `/monitoring/` - Observabilité

```
monitoring/
├── docker-compose.observability.yml
├── monitoring/
│   ├── prometheus/
│   ├── grafana/
│   ├── loki/
│   └── alertmanager/
└── ...
```

## Fichiers de Configuration

### Configuration Jekyll
- `app/_config.yml` : Configuration principale Jekyll
- `app/Gemfile` : Dépendances Ruby
- `app/staticman.yml` : Configuration commentaires

### Configuration Python/Flask
- `requirements.txt` : Dépendances Python
- `requirements-dev.txt` : Dépendances développement
- `pyproject.toml` : Configuration Python moderne
- `run.py` : Point d'entrée Flask

### Configuration CI/CD
- `.github/workflows/jekyll-pages.yml` : Workflow GitHub Pages
- `.pre-commit-config.yaml` : Hooks pre-commit

### Configuration Docker
- `docker-compose.yml` : Services Docker
- `app/Dockerfile` : Image Docker Jekyll

## Fichiers Ignorés

Les fichiers suivants sont ignorés par Git (voir `.gitignore`) :
- `app/_site/` : Build output Jekyll
- `app/site/` : Build output alternatif
- `.venv/`, `venv/` : Environnements virtuels Python
- `__pycache__/` : Cache Python
- `.env*` : Variables d'environnement
- `*.log` : Fichiers de logs
- `*.db`, `*.sqlite` : Bases de données locales

## Workflow de Développement

1. **Développement Local**
   - Jekyll : `cd app && bundle exec jekyll serve`
   - Flask : `python run.py`

2. **Commit**
   - Pre-commit hooks vérifient le code
   - Tests automatiques

3. **Déploiement**
   - Push sur `main` déclenche le workflow
   - Jekyll build et déploiement sur GitHub Pages
   - Site disponible sur `https://smdlabtech.github.io/`

## Bonnes Pratiques

- ✅ Séparer frontend (Jekyll) et backend (Flask)
- ✅ Utiliser des workflows GitHub Actions pour CI/CD
- ✅ Documenter la structure du projet
- ✅ Ignorer les fichiers de build et temporaires
- ✅ Utiliser pre-commit hooks pour la qualité du code
