# Tester l’application avant push en prod

Ce guide décrit comment vérifier que l’application fonctionne en local avant de pousser sur `main` (déploiement automatique vers GitHub Pages et Cloud Run).

---

## Prérequis

- **Ruby** (pour Jekyll) : `ruby -v` → 3.x recommandé  
- **Bundler** : `gem install bundler`  
- **Python** 3.10+ (pour Flask et les tests) : `python3 --version`  
- **pip** : pour installer les dépendances Python  

---

## Étape 1 : Vérification automatique (tests + build)

À la **racine du dépôt** :

```bash
chmod +x app/scripts/test-local.sh
./app/scripts/test-local.sh
```

Le script :

1. Lance les **tests pytest** (unitaires et intégration).
2. Vérifie le **build Jekyll** (`bundle exec jekyll build`).

Si une de ces étapes échoue, corriger avant de pousser en prod.

**Première fois (Python)** : créer un environnement virtuel et installer les dépendances :

```bash
cd app
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
cd ..
./app/scripts/test-local.sh
```

---

## Étape 2 : Lancer le site en local (test manuel)

### Frontend (Jekyll) – site statique

```bash
cd app
bundle install
bundle exec jekyll serve
```

(Exécuter `bundle install` une seule fois.)

Ouvrir **http://localhost:4000** et vérifier :

- Page d’accueil, navigation, articles, pages (About, Projects, Tags, etc.).
- Aucune erreur dans la console du navigateur.

### Backend (Flask) – optionnel

Si vous utilisez l’API ou les fonctionnalités Flask :

```bash
cd app
source .venv/bin/activate
pip install -r requirements.txt
# Copier env.example vers .env si besoin
python run.py
```

Ouvrir **http://localhost:8080** (et par ex. http://localhost:8080/health).

---

## Étape 3 : Push en prod

Une fois que :

- `./app/scripts/test-local.sh` passe,
- le site Jekyll en local vous convient (et éventuellement l’API Flask),

vous pouvez pousser sur `main` :

```bash
git add .
git commit -m "votre message"
git push origin main
```

Le déploiement se fera via les workflows GitHub Actions (voir `.github/workflows/`).

---

## Dépannage

| Problème | Piste de solution |
|----------|--------------------|
| `ModuleNotFoundError: No module named 'flask'` | Activer le venv (`source app/.venv/bin/activate`) et réinstaller : `pip install -r app/requirements.txt`. |
| `bundle: command not found` | Installer Ruby puis `gem install bundler`, et dans `app/` : `bundle install`. |
| Tests échouent | Lancer `PYTHONPATH=app python3 -m pytest tests/ -v` depuis la racine pour voir le détail. |
| Build Jekyll échoue | Vérifier `app/_config.yml` et les fichiers dans `app/_posts/`, puis `cd app && bundle exec jekyll build`. |

---

*Voir aussi : [CONTRIBUTING.md](CONTRIBUTING.md), [STRUCTURE.md](STRUCTURE.md).*
