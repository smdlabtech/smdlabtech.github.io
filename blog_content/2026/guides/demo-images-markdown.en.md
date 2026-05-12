---
slug_override: "2026-demo-images-markdown-en"
title: "Images in the blog: paths, covers, and figures"
date: 2026-04-17
description: "Full example: cover under public/posts/, SVG figure, and Markdown best practices."
image: /posts/2026/guide-images-cover.svg
author:
  name: SMD LABTECH
  avatar: /logo-mark.svg
category: Content
tags: [Markdown, Next.js, Accessibility, Images]
---

# Images in the blog: paths, covers, and figures

This post shows how to store **local images** under `frontend/public/posts/2026/` and reference them with **absolute paths** (`/posts/2026/...`).

## Cover and card image

The frontmatter `image` field uses the same asset as the hero: `/posts/2026/guide-images-cover.svg`.

## Inline figure

The diagram below summarizes the flow: files live in `public/`, URLs are rooted at the site origin.

![Diagram public → URL](/posts/2026/guide-images-diagram.svg)

## Best practices

1. **Name** files without spaces (`guide-images-cover.svg`).
2. **Prefer** `/posts/2026/my-file.png` instead of paths relative to the post slug.
3. **Provide** meaningful `alt` text for accessibility.

### Example Markdown

`![Caption](/posts/2026/guide-images-diagram.svg)` renders a responsive image for local paths via Next.js.

## External image

You can also link to a remote asset (CDN):

![External PNG demo](https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png)

> In production, review your **CSP** when loading third-party domains.

## Conclusion

**Markdown + frontmatter** plus assets in **`frontend/public/posts/YYYY/`** keeps posts easy to review in Git while displaying well on the platform.
