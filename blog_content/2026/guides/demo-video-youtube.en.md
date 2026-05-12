---
slug_override: "2026-demo-video-youtube-en"
title: "YouTube videos: links and embeds in Markdown posts"
date: 2026-04-17
description: "Video link plus embedded player (iframe) — demo aligned with the react-markdown stack."
image: /posts/2026/video-embed-cover.svg
author:
  name: SMD LABTECH
  avatar: /logo-mark.svg
category: Media
tags: [YouTube, Markdown, Video, Accessibility]
---

# YouTube videos: links and embeds in Markdown posts

Two complementary options: a **link** (opens YouTube) and an **embed** to watch inline.

## Simple link

[Open the sample video on YouTube](https://www.youtube.com/watch?v=M7lc1UVf-VE)

## Embedded player (iframe)

The player below uses the official **embed** URL (`youtube.com/embed/...`). The app only renders allowlisted YouTube iframes.

<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/M7lc1UVf-VE"
  title="YouTube sample video"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>

## Production notes

- Review **Content-Security-Policy** if you lock down `frame-src`: allow `https://www.youtube.com` and optionally `https://www.youtube-nocookie.com`.
- Provide a clear **title** on the iframe for assistive technologies.

## Conclusion

Use **links** for sharing and lightweight pages, and **embeds** when you want an immersive in-page experience.
