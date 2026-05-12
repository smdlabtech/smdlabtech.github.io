# 📜 Documentation des Scripts

**Voir [scripts/README.md](README.md)** pour l’arborescence (dev / quality / build / i18n / ops / lib) et les conventions.

Ce projet contient des scripts pour **deux applications** :
- **Flask** : Scripts Python/Flask
- **Jekyll** : Scripts Ruby/Jekyll

Les scripts sont organisés en sous-dossiers ; des wrappers à la racine de `scripts/` conservent les anciens chemins (ex. `./scripts/setup_complete.sh`).

---

## 🌐 Scripts Jekyll

### `setup_jekyll.sh` - Configuration Jekyll

**Description** : Configure l'environnement Jekyll (Ruby, Bundler, dépendances).

**Usage** :
```bash
./scripts/build/setup_jekyll.sh
# ou
./scripts/setup_jekyll.sh
```

**Ce qu'il fait** :
1. ✅ Vérifie/installe Ruby
2. ✅ Vérifie/installe Bundler
3. ✅ Installe les dépendances Jekyll (`bundle install`)
4. ✅ Vérifie la structure Jekyll

**Exemple** :
```bash
./scripts/setup_jekyll.sh
```

---

### `launch_jekyll.sh` - Lancement Jekyll

**Description** : Lance le serveur Jekyll en local.

**Usage** :
```bash
# Mode standard
./scripts/build/launch_jekyll.sh
# ou ./scripts/launch_jekyll.sh

# Avec live reload (rechargement automatique)
./scripts/launch_jekyll.sh --livereload
```

**Ce qu'il fait** :
1. ✅ Vérifie Ruby et Bundler
2. ✅ Vérifie les dépendances
3. ✅ Vérifie la structure Jekyll
4. ✅ Lance `bundle exec jekyll serve`

**Configuration** :
- Port par défaut : `4000` (modifiable via `JEKYLL_PORT`)
- Host par défaut : `127.0.0.1` (modifiable via `JEKYLL_HOST`)

**Exemple** :
```bash
# Port personnalisé
export JEKYLL_PORT=4001
./scripts/launch_jekyll.sh --livereload
```

---

### `test_jekyll.sh` - Test de Configuration Jekyll

**Description** : Vérifie que tout est correctement configuré pour Jekyll.

**Usage** :
```bash
./scripts/test_jekyll.sh
```

**Ce qu'il vérifie** :
1. ✅ Ruby installé
2. ✅ Bundler installé
3. ✅ Gemfile présent
4. ✅ _config.yml présent
5. ✅ Structure des dossiers (_posts, _layouts, _includes, _data)
6. ✅ Dépendances installées

**Exemple** :
```bash
./scripts/test_jekyll.sh
```

---

## 🐍 Scripts Flask

## 🚀 Scripts Disponibles

### 1. `setup_complete.sh` - Setup Complet du Projet

**Description** : Script complet qui configure tout le projet en une seule commande.

**Usage** :
```bash
# Développement (par défaut)
./scripts/setup_complete.sh

# Ou explicitement
./scripts/setup_complete.sh development

# Production
./scripts/setup_complete.sh production
```

**Ce qu'il fait** :
1. ✅ Vérifie Python
2. ✅ Crée l'environnement virtuel
3. ✅ Met à jour pip
4. ✅ Installe les dépendances (dev si development)
5. ✅ Génère le fichier .env avec clés secrètes
6. ✅ Installe les pre-commit hooks
7. ✅ Initialise la base de données
8. ✅ Crée les dossiers nécessaires

**Exemple** :
```bash
./scripts/setup_complete.sh development
```

---

### 2. `generate_env.sh` - Génération du Fichier .env

**Description** : Génère automatiquement le fichier `.env` avec des clés secrètes sécurisées.

**Usage** :
```bash
# Développement (par défaut)
./scripts/dev/generate_env.sh
# ou ./scripts/generate_env.sh

# Production
./scripts/generate_env.sh production
```

**Ce qu'il fait** :
1. ✅ Copie `env.example` ou `env.production.example`
2. ✅ Génère automatiquement `SECRET_KEY` et `JWT_SECRET_KEY`
3. ✅ Crée le dossier `instance/` si nécessaire
4. ✅ Affiche des conseils selon l'environnement

**Génération des clés secrètes** :
- Utilise `python3 -c "import secrets; print(secrets.token_hex(32))"` si disponible
- Sinon utilise `openssl rand -hex 32`
- Sinon génère une clé basée sur la date

**Exemple** :
```bash
./scripts/generate_env.sh development
```

---

### 3. `setup_dev.sh` - Setup Développement (Legacy)

**Description** : Ancien script de setup, remplacé par `setup_complete.sh`.

**Usage** :
```bash
./scripts/setup_dev.sh
```

**Note** : Utilisez `setup_complete.sh` à la place pour une meilleure expérience.

---

### 4. `setup_db.py` - Initialisation de la Base de Données

**Description** : Initialise la base de données SQLite.

**Usage** :
```bash
python scripts/setup_db.py
```

**Ce qu'il fait** :
- Crée toutes les tables
- Optionnellement ajoute des données de test

---

### 5. `run_tests.sh` - Exécution des Tests

**Description** : Exécute tous les tests avec coverage.

**Usage** :
```bash
./scripts/quality/run_tests.sh
# ou ./scripts/run_tests.sh
```

**Ce qu'il fait** :
- Configure PYTHONPATH
- Exécute pytest avec coverage
- Génère un rapport HTML

---

## 📋 Workflow Recommandé

### Première Installation - Flask

```bash
# 1. Cloner le repo
git clone <repo-url>
cd smdlabtech.github.io

# 2. Setup complet Flask
./scripts/setup_complete.sh development

# 3. Vérifier .env
cat .env

# 4. Lancer l'application Flask
./scripts/launch_app.sh
```

### Première Installation - Jekyll

```bash
# 1. Cloner le repo
git clone <repo-url>
cd smdlabtech.github.io

# 2. Test de configuration
./scripts/test_jekyll.sh

# 3. Setup Jekyll
./scripts/setup_jekyll.sh

# 4. Lancer Jekyll
./scripts/launch_jekyll.sh --livereload
```

### Régénérer .env

```bash
# Si vous avez besoin de régénérer .env
./scripts/generate_env.sh development
```

### Setup Production

```bash
# Générer .env pour la production
./scripts/generate_env.sh production

# Puis modifier manuellement les valeurs critiques
nano .env
```

---

## 🔧 Dépannage

### Problème : Permission denied

```bash
chmod +x scripts/*.sh
```

### Problème : Python non trouvé

```bash
# Vérifier Python
python3 --version

# Installer Python si nécessaire
# macOS: brew install python3
# Linux: sudo apt-get install python3
```

### Problème : pip non trouvé

```bash
# Installer pip
python3 -m ensurepip --upgrade
```

### Problème : Scripts ne fonctionnent pas sur macOS

Les scripts sont compatibles macOS et Linux. Si vous avez des problèmes avec `sed`, le script `generate_env.sh` gère automatiquement les différences.

---

## 📝 Notes

- Tous les scripts sont exécutables (`chmod +x`)
- Les scripts utilisent des couleurs pour une meilleure lisibilité
- Les scripts vérifient les prérequis avant d'exécuter
- Les scripts sont idempotents (peuvent être exécutés plusieurs fois)

---

## 🎯 Résumé des Scripts

### Jekyll (build/, misc/)
- `build/setup_jekyll.sh` : Configuration initiale
- `build/launch_jekyll.sh` : Lancement du serveur
- `misc/test_jekyll.sh` : Test de configuration

### Flask (dev/, quality/)
- `dev/setup_complete.sh` : Setup complet
- `dev/generate_env.sh` : Génération .env
- `dev/launch_app.sh` : Lancement Flask
- `quality/test_app.sh` : Tests unitaires
- `quality/test_endpoints.sh` : Tests endpoints
- `dev/setup_db.py` : Initialisation DB

### i18n (i18n/)
- `i18n/compile-translations.sh` : Compilation .po → .mo
- `i18n/validate_translations.sh` : Vérification clés/traductions

---

## 🎯 Prochaines Améliorations

- [ ] Script de déploiement
- [ ] Script de backup de la base de données
- [ ] Script de migration de données
- [ ] Script de monitoring
- [ ] Script de build Jekyll pour production
