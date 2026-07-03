# SoraPaper Astro Theme

SoraPaper is a soft, content-first Astro blog theme inspired by the readability of Astro Paper and the gentle visual language of Fuwari, Koharu and Yukina.

## Features

- Astro static-first blog architecture.
- Markdown and MDX posts through Content Collections.
- Typed frontmatter for title, description, dates, tags, category, draft, cover, series, TOC and pinned posts.
- Built-in i18n structure for Chinese and English without visible locale prefixes.
- Soft glass cards, rounded surfaces, light/dark mode and four color schemes.
- Homepage hero, latest posts, profile sidebar, tags and now card.
- Archive, tag index, tag detail, about and friends pages.
- Article layout with metadata, reading time, floating TOC and reading progress.
- Zero-dependency localized static search using `/search.json`.
- RSS and sitemap-ready configuration.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Content

Create posts in `src/content/blog` using Markdown or MDX:

```yaml
---
title: "Astro Theme Design Notes"
description: "Readable writing with a soft visual system."
lang: en
translationKey: astro-theme-design
pubDate: 2026-07-02
updatedDate: 2026-07-03
tags: ["Astro", "Design"]
category: "Frontend"
draft: false
cover:
  src: "/covers/sky.svg"
  alt: "Soft sky illustration."
pinned: true
toc: true
---
```

## Theme Configuration

Edit the root `sorapaper.ts` file for site metadata, author profile, feature flags, sidebar content, localized navigation, hero text and page copy.

Internal files such as `src/config/theme.ts` and `src/i18n/ui.ts` provide defaults. If the same option is defined in `sorapaper.ts`, the root config wins.

The main visual system lives in `src/styles/global.css`. Use the CSS variables there for new components instead of hard-coded colors, shadows and radii.

Social icons live in `public/assets/social`. Author links in `sorapaper.ts` are matched by `label` or optional `icon`, for example `GitHub`, `Email`, `X`, `WeChat`, `Bilibili`, `Discord`, `Telegram`, `LinkedIn`, `Instagram`, `YouTube`, `RSS` and `Website`.

## Internationalization

Chinese is the default locale. Routes stay clean without `/zh` or `/en` prefixes; the language toggle stores the current locale in `localStorage.locale`.

Add `lang: zh` or `lang: en` to each post frontmatter. Use the same `translationKey` for translated versions of the same article.

## Design Handoff

See `docs/design-handoff.md` for implementation rules and visual acceptance criteria.

For deeper architecture, extension and bug-fixing guidance, see `docs/development-guide.md`.
