---
slug_override: "2026-demo-images-markdown"
title: "Images dans le blog : chemins, couvertures et figures"
date: 2026-04-17
description: "Exemple complet : couverture sous public/posts/, figure SVG et bonnes pratiques Markdown."
image: /posts/2026/guide-images-cover.svg
author:
  name: SMD LABTECH
  avatar: /logo-mark.svg
category: Contenu
tags: [Markdown, Next.js, Accessibilité, Images]
---

# Images dans le blog : chemins, couvertures et figures

Cet article illustre comment placer des **images locales** dans `frontend/public/posts/2026/` et les référencer avec des **chemins absolus** (`/posts/2026/...`).

## Couverture et carte

Le champ `image` du frontmatter pointe vers la même couverture que celle affichée en haut de l’article : `/posts/2026/guide-images-cover.svg`.

## Figure dans le corps

Le schéma ci-dessous résume le flux : fichiers dans `public/`, URLs depuis la racine du site.

![Schéma public → URL](/posts/2026/guide-images-diagram.svg)

## Bonnes pratiques

1. **Nommer** les fichiers sans espaces (`guide-images-cover.svg`).
2. **Préférer** `/posts/2026/mon-fichier.png` plutôt qu’un chemin relatif au slug.
3. **Renseigner** le texte alternatif des images pour l’accessibilité.

### Exemple de balise générée

Le Markdown `![Légende](/posts/2026/guide-images-diagram.svg)` produit une image responsive via Next.js pour les chemins locaux.

## Lien vers une ressource externe

Vous pouvez aussi pointer vers une image distante (hébergée sur un CDN) :

![Logo placeholder externe](https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png)

> En production, vérifiez la politique de contenu (CSP) si vous chargez des domaines tiers.

## Conclusion

Avec **Markdown + frontmatter** et des assets sous **`frontend/public/posts/YYYY/`**, les articles restent simples à versionner tout en s’affichant correctement sur la plateforme.
