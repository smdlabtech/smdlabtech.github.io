# 📘 README – Lancer smdlabtech.github.io en local sur macOS

## 🚀 Objectif

Ce guide vous permet de cloner, installer et exécuter le site web de smdlabtech (portfolio de data scientist) en local sur votre Mac avec Jekyll.

---

## ✅ Prérequis

- macOS (Apple Silicon ou Intel)
- [Homebrew](https://brew.sh/) installé
- Terminal (`zsh`)
- Compte GitHub (si clonage distant)

---

## 🧰 Étapes complètes

### 1. 📥 Cloner le dépôt smdlabtech

```bash
git clone https://github.com/smdlabtech/smdlabtech.github.io
cd smdlabtech.github.io
```

### 2. 💎 Installer Ruby et Bundler (si pas déjà fait)

```bash
brew install ruby
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
echo 'export GEM_HOME="$HOME/.gem"' >> ~/.zshrc
echo 'export PATH="$HOME/.gem/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
gem install bundler jekyll --user-install
```

### 3. 📦 Installer les dépendances du projet

```bash
bundle install
```

### 4. 🚀 Lancer le serveur Jekyll

```bash
bundle exec jekyll serve
```

Puis ouvre ton navigateur à cette adresse :

```
http://localhost:4000
```

### 💡 Optionnel : Live Reload

```bash
bundle exec jekyll serve --livereload
```

---

## 🧪 Dépannage rapide

| Problème | Solution |
|----------|----------|
| `gem` non reconnu | Vérifie Ruby avec `brew install ruby` |
| `bundle` non reconnu | `gem install bundler` |
| Permission denied | Utilise `--user-install` |
| Could not find gem | Lance `bundle install` dans le dossier projet |

---

## 🗂️ Structure typique du projet

```
📂 smdlabtech.github.io
├── _config.yml
├── _posts/
├── _layouts/
├── _includes/
├── assets/
├── index.md
└── ...
```

---

## 📊 À propos du projet

Ce site web est le portfolio de Daya, data scientist passionné de sport (soccer et basketball), qui partage ses projets en :
- Python
- R
- SQL  
- Power BI
- Excel VBA

Analyse de code disponible sur [SonarQube.io](https://sonarcloud.io/project/overview?id=smdlabtech_smdlabtech.github.io)

---

## 📄 Licence

Ce projet appartient à smdlabtech. Consultez le repository pour plus d'informations sur les droits d'utilisation.