# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à ce projet !

## 📋 Comment Contribuer

### 1. Fork et Clone

```bash
git clone https://github.com/smdlabtech/smdlabtech.github.io.git
cd smdlabtech.github.io
```

### 2. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 3. Développement

#### Pour Jekyll (Frontend)
```bash
cd app
bundle install
bundle exec jekyll serve
```

#### Pour Flask (Backend)
```bash
./scripts/dev/setup_complete.sh
./scripts/dev/launch_app.sh
# ou manuellement : cd app && python run.py
```

### 4. Tests

Assurez-vous que tous les tests passent :
```bash
# Tests Python (depuis la racine du repo)
PYTHONPATH=app python3 -m pytest tests/ -v

# Ou scripts dédiés
./scripts/quality/run_tests.sh
./app/scripts/test-local.sh

# Tests rate limiting
PYTHONPATH=app python3 -m pytest tests/test_rate_limiting.py -v

# Build Jekyll
cd app && bundle exec jekyll build
```

### 5. Pre-commit Hooks

Installez les hooks pre-commit :
```bash
pip install pre-commit
pre-commit install
```

### 6. Commit

```bash
git add .
git commit -m "feat: ajout d'une nouvelle fonctionnalité"
```

### 7. Push et Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis créez une Pull Request sur GitHub.

## 📝 Standards de Code

### Python
- Utiliser `black` pour le formatage
- Utiliser `flake8` pour le linting
- Respecter PEP 8

### JavaScript
- Utiliser des noms de variables descriptifs
- Commenter le code complexe

### HTML/CSS
- Utiliser des balises sémantiques
- Respecter l'accessibilité (ARIA)

## 🎯 Types de Contributions

- 🐛 **Bug fixes** : `fix: description`
- ✨ **Nouvelles fonctionnalités** : `feat: description`
- 📝 **Documentation** : `docs: description`
- 🎨 **Style** : `style: description`
- ♻️ **Refactoring** : `refactor: description`
- ⚡ **Performance** : `perf: description`
- ✅ **Tests** : `test: description`

## 📚 Ressources

- [Structure du projet](STRUCTURE.md)
- [Scripts (dev, quality, i18n, ops)](../scripts/README.md)
- [Rate limiting (API)](RATE_LIMITING.md)
- [Documentation Jekyll](https://jekyllrb.com/docs/)
- [Documentation Flask](https://flask.palletsprojects.com/)

Merci pour votre contribution ! 🎉
