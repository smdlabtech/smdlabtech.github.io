
# Développement d'une Application GitHub Pages en Local

Ce document détaille les étapes pour lancer une application GitHub Pages en local afin de voir les modifications apportées en cours de développement.

---

## 1. Installer les dépendances nécessaires

Si votre projet utilise Jekyll (le moteur de site statique pour GitHub Pages) ou un autre framework, vous devez installer les outils requis.

### a. **Installer Ruby et Bundler**
1. Assurez-vous d'avoir **Ruby** installé sur votre machine.
   - **macOS/Linux** : Ruby est souvent préinstallé.
   - **Windows** : [Téléchargez Ruby](https://rubyinstaller.org/).
2. Installez Bundler pour gérer les dépendances :
   ```bash
   gem install bundler
   ```

### b. **Installer Jekyll**
Installez Jekyll avec la commande :
```bash
gem install jekyll
```

---

## 2. Cloner votre projet

Si ce n’est pas déjà fait, clonez votre dépôt GitHub en local :
```bash
git clone https://github.com/username/repository.git
cd repository
```

---

## 3. Installer les dépendances du projet

Si un fichier `Gemfile` est présent dans le projet, utilisez Bundler pour installer les dépendances :
```bash
bundle install
```

---

## 4. Lancer le serveur local

Pour lancer l'application, utilisez la commande :
```bash
bundle exec jekyll serve
```

Cela démarre un serveur local (par défaut sur `http://localhost:4000`) et compile les fichiers statiques.

---

## 5. Déboguer et surveiller les changements

Le serveur surveille automatiquement les changements dans les fichiers locaux et recharge le site. Si cela ne fonctionne pas, ajoutez l'option `--livereload` :
```bash
bundle exec jekyll serve --livereload
```

---

## 6. Cas où vous n'utilisez pas Jekyll

Si votre projet est un site HTML/CSS/JS pur ou utilise un autre framework (par exemple, React ou Vue), vous pouvez utiliser un serveur HTTP simple comme `http-server` :

### a. **Installer http-server**
Assurez-vous d’avoir Node.js installé, puis installez `http-server` :
```bash
npm install -g http-server
```

### b. **Lancer le serveur**
Dans le dossier de votre projet, exécutez :
```bash
http-server
```

Cela démarre un serveur sur `http://localhost:8080` par défaut.

---

Ces étapes vous permettent de voir et de tester vos modifications localement avant de les déployer sur GitHub Pages. Si vous rencontrez un problème spécifique, n’hésitez pas à fournir des détails supplémentaires.
