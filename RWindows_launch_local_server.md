# 📘 README – Lancer `smdlabtech.github.io` en local sur **Windows**

## 🚀 Objectif
Ce guide explique comment cloner, configurer et lancer le site portfolio Jekyll (`smdlabtech.github.io`) en **local sur Windows 10/11**.

---

## ✅ Prérequis
- Windows 10 ou 11
- PowerShell (avec droits administrateur)
- [Git for Windows](https://git-scm.com/) (optionnel, peut être installé via Chocolatey)
- Navigateur web (Chrome, Firefox, etc.)

---

## 🧰 Étapes détaillées

### 1. 📥 Cloner le dépôt GitHub
Ouvre PowerShell ou Git Bash :
```bash
git clone https://github.com/smdlabtech/smdlabtech.github.io
cd smdlabtech.github.io
```

### 2. 💎 Installer Chocolatey (gestionnaire de paquets Windows)
Ouvre PowerShell **en tant qu'administrateur** et exécute :
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; `
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; `
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

### 3. 💎 Installer Ruby et Git via Chocolatey
Ouvre PowerShell **en tant qu'administrateur** et exécute :
```powershell
choco install ruby -y
choco install git -y
refreshenv
```

### 4. 💎 Installer Jekyll
Ouvre PowerShell **en tant qu'administrateur** et exécute :
```powershell
gem install bundler jekyll
```

### 5. 💎 Configurer le site
Ouvre PowerShell ou Git Bash et exécute :
```bash
bundle install
```

### 6. 💎 Lancer le site
Ouvre PowerShell ou Git Bash et exécute :
```bash
bundle exec jekyll serve
```

---

## 📋 Notes
- **Chocolatey** est un gestionnaire de paquets pour Windows.
- **Ruby** est un langage de programmation.
- **Git** est un système de gestion de versions.
- **Jekyll** est un générateur de site statique.

---

## 📋 Exemple de commande
```powershell
choco -v
```

---

## 📋 Exemple de commande
```bash
bundle install
```

---

## 📋 Exemple de commande
```bash
bundle exec jekyll serve
```