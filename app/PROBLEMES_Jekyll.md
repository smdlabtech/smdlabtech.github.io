# ⚠️ Problèmes Jekyll Détectés

## 🔴 Problème 1 : Conflit de Fichiers Dupliqués

### Description
Plusieurs fichiers avec le même nom génèrent le même URL, créant un conflit :

```
Conflit détecté : /_site/2024-04-07-covid19-pandemic/index.html

Fichiers en conflit :
1. /_posts/2024-04-07-covid19-pandemic.md
2. /_posts/2024/topics/ai/2024-04-07-covid19-pandemic.md
3. /_posts/2024/topics/dataviz/2024-04-07-covid19-pandemic.md
4. /_posts/2024/topics/uses_cases/2024-04-07-covid19-pandemic.md
5. /_posts/2025/topics/ai/2024-04-07-covid19-pandemic.md
6. /_posts/2025/topics/dataviz/2024-04-07-covid19-pandemic.md
7. /_posts/2025/topics/uses_cases/2024-04-07-covid19-pandemic.md
```

### Solution Recommandée

**Option 1 : Supprimer les doublons** (Recommandé)
- Garder uniquement le fichier principal : `/_posts/2024-04-07-covid19-pandemic.md`
- Supprimer tous les doublons dans les sous-dossiers

**Option 2 : Renommer les fichiers**
- Ajouter un suffixe unique à chaque fichier :
  - `2024-04-07-covid19-pandemic-ai.md`
  - `2024-04-07-covid19-pandemic-dataviz.md`
  - `2024-04-07-covid19-pandemic-uses-cases.md`

**Option 3 : Utiliser des permalinks uniques**
- Ajouter `permalink` dans le front matter de chaque fichier :
```yaml
permalink: /2024/04/07/covid19-pandemic-ai/
```

---

## 🔴 Problème 2 : Port Livereload Occupé

### Description
Le port livereload (35729) est déjà utilisé par un processus (PID 62537).

### Solution

**Option 1 : Tuer le processus** (Déjà fait)
```bash
kill 62537
```

**Option 2 : Désactiver livereload**
```bash
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --no-livereload
```

**Option 3 : Utiliser un autre port**
```bash
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --livereload --livereload-port 35730
```

---

## 📋 Actions à Effectuer

### Immédiat
1. ✅ Processus livereload tué
2. ✅ Conflits de fichiers résolus (6 doublons supprimés)

### Recommandations
1. **Nettoyer les doublons** dans `_posts/`
2. **Organiser les posts** par catégories avec des noms uniques
3. **Vérifier** qu'il n'y a pas d'autres conflits

---

## 🚀 Commande Corrigée

```bash
# Sans livereload (si problème persiste)
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --no-livereload

# Avec livereload (après nettoyage)
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --livereload
```

---

**Date** : 2024
**Statut** : ⚠️ Actions requises
