---
slug_override: "2026-demo-video-youtube"
title: "Vidéos YouTube : lien et embed dans un article Markdown"
date: 2026-04-17
description: "Lien vers une vidéo puis lecteur intégré (iframe) — démo alignée avec la stack react-markdown."
image: /posts/2026/video-embed-cover.svg
author:
  name: SMD LABTECH
  avatar: /logo-mark.svg
category: Médias
tags: [YouTube, Markdown, Vidéo, Accessibilité]
---

# Vidéos YouTube : lien et embed dans un article Markdown

Deux approches complémentaires : un **lien** (ouvre YouTube) et un **embed** pour lire la vidéo sans quitter le blog.

## Lien simple

[Ouvrir la vidéo de démonstration sur YouTube](https://www.youtube.com/watch?v=M7lc1UVf-VE)

## Lecteur intégré (iframe)

La vidéo ci-dessous utilise l’URL d’**embed** officielle (`youtube.com/embed/...`). Seules les iframes YouTube autorisées sont rendues côté application.

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/M7lc1UVf-VE"
  title="Vidéo de démonstration YouTube"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

## Notes production

- Contrôlez la **Content-Security-Policy** si vous restreignez `frame-src` : ajoutez `https://www.youtube.com` et éventuellement `https://www.youtube-nocookie.com`.
- Préférez un **titre** explicite sur l’iframe pour les lecteurs d’écran.

## Conclusion

Combinez **lien** (partage, accessibilité hors ligne) et **embed** (parcours immersif) selon le contexte de lecture.
