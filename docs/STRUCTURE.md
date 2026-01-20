# 📁 Structure du Repository

## Vue d'ensemble

Ce repository contient une plateforme complète combinant :
- **Frontend Jekyll** : Site statique déployé sur GitHub Pages
- **Backend Flask** : API REST pour les fonctionnalités dynamiques
- **CI/CD** : Automatisation avec GitHub Actions
- **Monitoring** : Stack d'observabilité (Prometheus, Grafana, Loki)

## Structure Détaillée

### `/app/` - Application Jekyll (Frontend)

```
app/
├── _config.yml              # Configuration principale Jekyll
├── _includes/               # Templates HTML réutilisables
│   ├── header.html
│   ├── footer.html
│   ├── nav-databird.html
│   └── ...
├── _layouts/                # Layouts de pages
│   ├── base.html
│   ├── home.html
│   ├── post.html
│   └── ...
├── _posts/                  # Articles de blog
│   ├── 2024/
│   │   └── topics/
│   │       ├── ai/
│   │       ├── dataviz/
│   │       └── uses_cases/
│   └── 2025/
│       └── topics/
├── assets/                  # Ressources statiques
│   ├── css/                # Styles CSS
│   ├── js/                 # Scripts JavaScript
│   └── img/                # Images
├── data/                    # Données YAML
│   ├── articles.yml
│   ├── navigation.yml
│   └── projects.yml
├── index.html              # Page d'accueil
├── about.md                # Page À propos
├── explore.html            # Page d'exploration
├── projects.html           # Page projets
└── tags.html               # Page tags
```

### `/src/` - Application Flask (Backend)

```
src/
├── __init__.py             # Factory Flask
├── api/                    # Endpoints API
│   ├── newsletter.py
│   └── ...
├── routes/                 # Routes Flask
│   ├── main.py
│   └── ...
├── services/               # Services métier
├── database/               # Modèles de données
├── config/                 # Configuration
└── templates/              # Templates Flask
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
