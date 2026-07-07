# SoraPaper Astro Theme

SoraPaper is a soft, content-first Astro blog theme inspired by the readability of Astro Paper and the gentle visual language of Fuwari, Koharu and Yukina.

## Features

- Astro static-first blog architecture.
- Markdown and MDX posts through Content Collections.
- Typed frontmatter for title, description, dates, tags, category, draft, cover, series, TOC and pinned posts.
- Built-in i18n structure for Chinese and English without visible locale prefixes.
- Soft glass cards, rounded surfaces, light/dark mode and four color schemes.
- Homepage hero, latest posts, profile sidebar, tags and now card.
- Archive, tag index, tag detail, about, friends and travel pages.
- Article layout with metadata, reading time, floating TOC, reading progress and previous/next post navigation.
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

### Markdown Extensions

SoraPaper supports directive-style blocks in Markdown and MDX posts.

Callouts use three colons, a supported type and optional title:

```md
:::info
This is an informational note.
:::

:::warning[Heads up]
This block uses a custom title.
:::
```

Supported callout types are `note`, `info`, `tips`, `warning`, `success` and `error`. The alias `tip` renders as `tips`.

Foldable details blocks use native `details` / `summary` semantics:

```md
:::details[More context]
This content can be expanded by the reader.
:::
```

Tabs use four colons around multiple `tab` directives:

```md
::::tabs
:::tab[Preview]
Preview content.
:::
:::tab[Code]
Code content.
:::
::::
```

Images can use regular Markdown syntax or the `:::img` block when a caption, scale or live-photo source is needed:

```md
![Soft sky](/covers/sky.svg)

:::img{src="/covers/sky.svg" alt="Soft sky" caption="A quiet sky illustration." scale="80"}
:::

:::img{src="/photos/cat.jpg" live="/photos/cat-live.mov" alt="Cat" caption="A live photo placeholder."}
:::
```

The `:::img` block requires `src`; `alt` should be provided for accessibility. Optional attributes include `caption`, `scale`, `live`, `href`, `loading`, `decoding`, `title` and `credit`. `scale` defaults to `100`, meaning the image block matches the article body width.

## Theme Configuration

Edit the root `sorapaper.ts` file for site metadata, default Open Graph image, author profile, feature flags, sidebar content, localized navigation, hero text and page copy.

Internal files such as `src/config/theme.ts` and `src/i18n/ui.ts` provide defaults. If the same option is defined in `sorapaper.ts`, the root config wins. Set `site.ogImage` to an absolute URL or a public asset path such as `/covers/sky.svg` for the default social sharing image; article covers override it when present.

The main visual system lives in `src/styles/global.css`. Use the CSS variables there for new components instead of hard-coded colors, shadows and radii.

Social icons live in `public/assets/social`. Author links in `sorapaper.ts` are matched by `label` or optional `icon`, for example `GitHub`, `Email`, `X`, `WeChat`, `Bilibili`, `Discord`, `Telegram`, `LinkedIn`, `Instagram`, `YouTube`, `RSS` and `Website`.

## Internationalization

Chinese is the default locale. Routes stay clean without `/zh` or `/en` prefixes; the language toggle stores the current locale in `localStorage.locale`.

Add `lang: zh` or `lang: en` to each post frontmatter. Use the same `translationKey` for translated versions of the same article. When a translated article is missing, the language toggle keeps readers on the current post and only changes the interface locale; the notice text can be customized with `ui.{locale}.article.translationUnavailable`.

## Design Handoff

See `docs/design-handoff.md` for implementation rules and visual acceptance criteria.

For deeper architecture, extension and bug-fixing guidance, see `docs/development-guide.md`.
