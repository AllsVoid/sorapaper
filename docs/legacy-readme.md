# SoraPaper Astro Theme

SoraPaper is a soft, content-first Astro blog theme inspired by the readability of Astro Paper and the gentle visual language of Fuwari, Koharu and Yukina.

## Features

- Astro static-first blog architecture.
- Markdown and MDX posts through Content Collections.
- Typed frontmatter for title, description, dates, tags, category, draft, cover, series, TOC and pinned posts.
- Built-in i18n structure for Chinese and English without visible locale prefixes.
- Soft glass cards, rounded surfaces, light/dark mode and four color schemes.
- Homepage hero, latest posts, profile sidebar, tags and now card.
- Archive, tag index, tag detail, series index, series detail, about, friends and travel pages.
- Article layout with metadata, reading time, floating TOC, reading progress and previous/next post navigation.
- Build-time encrypted Markdown blocks unlocked in the browser with a passphrase.
- Pagefind-powered localized static search.
- RSS and sitemap-ready configuration.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Install from npm

Download the exact published release into an empty directory, then install its
dependencies and begin customizing `sorapaper.ts`:

```bash
mkdir your-site && cd your-site
npm pack sorapaper-astro-theme@1.0.0
tar -xzf sorapaper-astro-theme-1.0.0.tgz --strip-components=1
mv .sorapaper-package/pnpm-lock.yaml pnpm-lock.yaml
rmdir .sorapaper-package
pnpm install --frozen-lockfile
pnpm run dev
```

The published package contains the theme source, public assets, configuration
files and user-facing development documentation; it intentionally excludes
build output, dependencies and local development files. The tarball extraction
step is necessary because this package is a complete site starter, rather than
a runtime dependency.

### Release process

Maintainers should run the complete release gate before publishing:

```bash
pnpm run release:check
npm publish
```

`prepublishOnly` runs the same gate during `npm publish`: Astro type checking,
unit tests, a production build and a dry-run package-content inspection. The
package is published publicly and requires Node.js 22.12 or newer. Review the
version, changelog and `npm pack --dry-run` output before publishing.

## Cloudflare Workers

SoraPaper deploys to Cloudflare Workers as a static-assets site. Commit
`wrangler.jsonc` and keep its `name` equal to the Worker name selected in the
Cloudflare dashboard. For Workers Builds, leave the root directory blank and
configure:

```text
Build command: pnpm run build
Deploy command: npx wrangler deploy
Preview deploy command: npx wrangler versions upload
```

The committed Wrangler configuration uploads `dist` and uses `404-page`
handling. It avoids the automatic Astro SSR-adapter setup; add
`@astrojs/cloudflare` only when the site needs on-demand rendering or
Cloudflare runtime bindings. The included `pnpm-workspace.yaml` explicitly
lists the root package for Cloudflare's pnpm 10 dependency installation.

## Content

Create posts in `src/content/blog` using Markdown or MDX:

```yaml
---
title: "Astro Theme Design Notes"
description: "Readable writing with a soft visual system."
excerpt: "A more editorial summary for post cards, search results, RSS and generated social images."
slug: "astro-theme-design" # Optional custom URL slug; must be unique
lang: en
translationKey: astro-theme-design
pubDate: 2026-07-02
updatedDate: 2026-07-03
tags: ["Astro", "Design"]
category: "Frontend"
series: "Building SoraPaper"
seriesOrder: 1
draft: false
cover:
  src: "/covers/sky.svg"
  alt: "Soft sky illustration."
ogImage: "/og/custom-card.png"
pinned: true
toc: true
---
```

`series` groups connected posts, while optional `seriesOrder` fixes their intended reading order; posts without `seriesOrder` fall back to publication date. `description` is the stable SEO description. Optional `excerpt` is used for post cards, article intros, search results, RSS items and generated Open Graph images; when omitted, SoraPaper falls back to `description`. Optional `ogImage` lets a post override the generated social image. Optional `slug` overrides the filename-derived post URL and generated Open Graph image path; use a unique, URL-friendly value without leading or trailing slashes.

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

Encrypted blocks use the `:::encrypted` directive. The block body is rendered to HTML during the Astro build, encrypted with AES-256-GCM, and replaced by an unlock form in the generated page:

````md
:::encrypted[Private note]{password="your-passphrase"}
This paragraph, lists, code blocks and other rendered Markdown inside the block are encrypted in the final HTML.
:::
````

Readers unlock the block by entering the same `password` value in the page form. The password is used only during the build and is not written to the generated HTML. For a safer setup where the password does not live in Markdown source, omit `password` and provide the passphrase at build time with one of these environment variables:

```bash
SORAPAPER_ENCRYPTION_KEYS='{"diary":"your-passphrase","default":"another-passphrase"}'
SORAPAPER_ENCRYPTION_KEY_DIARY="your-passphrase"
SORAPAPER_ENCRYPTION_KEY="fallback-for-default-key"
```

Encrypted blocks protect the generated static HTML, RSS and search index from containing the block body. They do not protect the source Markdown file, repository history, build logs or anyone who has the passphrase. If `password` is written in Markdown, anyone with source access can read it. Avoid putting sensitive headings inside encrypted blocks, because generated table-of-contents data may expose heading text before the block is unlocked.

Code blocks use Astro's Shiki highlighter and are wrapped in an Apple-style code window with optional file names, source links, copy buttons, line numbers, highlighted lines and diff lines:

````md
```js title="hello.js" url="https://example.com" linkText="View source" mark:1,3
const greeting = "Hello";
const name = "World";
console.log(`${greeting}, ${name}!`);
```

```bash title="Terminal"
pnpm install
pnpm run dev
pnpm run build
```

```diff title="example.diff"
-const oldName = "Sora";
+const newName = "SoraPaper";
```
````

Set `codeBlocks.lineNumbers` or `codeBlocks.copyButton` in `sorapaper.ts` to control the built-in code block chrome. Per-block line numbers can be hidden with `noLineNumbers` or `lineNumbers=false` in the code fence meta.

Math formulas are written with LaTeX syntax inside Markdown. Use single dollar signs for inline formulas and double dollar signs for block formulas:

```md
Inline formula: $E = mc^2$

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$
```

Music and video embeds use standard leaf directives with a platform-neutral `provider` and `ref` pair:

```md
::music{provider="netease" ref="19723756"}
::music{provider="qq" ref="0039MnYb0qxYhV"}
::music{provider="netease" type="playlist" ref="60198"}
::music{provider="spotify" ref="track:11dFghVXANMlKmJXsNCbNl"}

::video{provider="bilibili" ref="BV1B7411m7LV"}
::video{provider="youtube" ref="M7lc1UVf-VE"}
```

`ref` is the provider-native reference: a NetEase ID, QQ Music ID, Spotify `track:ID` / `album:ID` / `playlist:ID`, Bilibili `BV…` / `av…` / `ep…`, or a YouTube video ID. NetEase and QQ Music default to `type="song"`; use `playlist`, `album` or `artist` when embedding another collection type. Complete page URLs remain available through `src` when copying a link is more convenient:

```md
::music{src="https://music.163.com/song?id=19723756"}
::video{src="https://www.youtube.com/watch?v=M7lc1UVf-VE" title="YouTube player demonstration"}
```

Local audio files placed under `public/` can use the same directive. `title` is required; `artist`, `cover` and inline `lyric` are optional:

```md
::music{provider="local" src="/media/song.mp3" title="Song title" artist="Artist" cover="/media/cover.webp"}
```

NetEase, QQ Music and local audio render with MetingJS and APlayer, loaded only on article pages containing music directives. Spotify and video providers continue to use lazy official iframes. The earlier `:::music URL:::` / `:::video URL:::` shorthand and empty container form remain supported for backward compatibility. Short links are intentionally unsupported because resolving them would make builds depend on third-party network redirects. Unsupported, malformed or incomplete references fail the build instead of emitting an arbitrary embed.

Mermaid diagrams use the `:::mermaid` directive. The optional title appears above the diagram, and the original source remains visible if JavaScript is disabled or rendering fails:

```md
:::mermaid[Publishing flow]
flowchart TD
  Markdown[Markdown post] --> Build[Astro build]
  Build --> Page[Static page]
:::
```

SoraPaper uses the official Mermaid renderer only on article pages that contain Mermaid blocks. Wide diagrams keep their readable SVG dimensions and can scroll horizontally on small screens; tap, click or press Enter/Space on a diagram to open a larger SVG preview. Mermaid runs with strict security settings, so static diagram syntax is supported while click handlers, unsafe HTML and interactive extensions are intentionally not part of the theme contract.

Footnotes use standard Markdown footnote syntax:

```md
Here is a note reference.[^1]

[^1]: This is the footnote content.
```

Article headings automatically receive quiet anchor links. Hover or focus a heading to reveal the `#` link, then click it to jump to that section and copy the full section URL.

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

:::img{src="/photos/cat.jpg" live="/photos/cat-live.mov" alt="Cat" caption="A Live Photo." ratio="4/3"}
:::
```

The `:::img` block requires `src`; `alt` should be provided for accessibility. Optional attributes include `caption`, `scale`, `live`, `ratio`, `photoTime`, `liveControls`, `livePreload`, `href`, `loading`, `decoding`, `title`, `credit` and `rounded`. `scale` defaults to `100`, meaning the image block matches the article body width.

Galleries reuse the existing `:::img` block. Use four colons for the outer directive so each nested image can close independently:

```md
::::gallery[Travel notes]{layout="carousel" rounded="true"}
:::img{src="/photos/one.jpg" alt="Mountain view" caption="Morning"}
:::
:::img{src="/photos/two.jpg" live="/photos/two.mov" alt="Lake view" caption="A Live Photo" ratio="4/3"}
:::
::::
```

`layout="carousel"` (the default) shows one full-width image at a time. `layout="stack"` presents the active image as the front card with the adjacent images tucked behind it. Both layouts support previous/next controls, clickable position dots, arrow keys, touch or pointer swipes, and horizontal wheel gestures. Nested `:::img` attributes—including captions, links, credits and Live Photo sources—continue to work. Without JavaScript, all images remain visible in document order. `rounded="true"` is the default; set `rounded="false"` on either `:::gallery` or an individual `:::img` block for square corners.

When `live` is provided, SoraPaper keeps the still image as a fallback and progressively enhances the block with Apple LivePhotosKit JS on article pages. Use `src` for the still JPEG photo and `live` for the paired MOV video file exported from the same Live Photo. `ratio` defaults to `16/9`; set it when the media is portrait or square so the player has a stable size before JavaScript loads. `liveControls` and `livePreload` map to LivePhotosKit's native controls and proactive video loading options.

For reliable playback, the JPEG and MOV should be a real Live Photo pair. In tested assets, the JPEG contains an Apple `MediaGroupUUID`, the MOV contains a QuickTime `ContentIdentifier`, and both values match.

## Theme Configuration

Edit the root `sorapaper.ts` file for site metadata, default Open Graph image, author profile, feature flags, sidebar content, localized navigation, hero text and page copy. Pagefind-powered search is enabled by default and does not require configuration.

The Travel page is optional and disabled by default. Set `featureFlags.travel` to `true` to show its navigation entry and enable the route:

```ts
featureFlags: {
  travel: true
}
```

Internal files such as `src/config/theme.ts` and `src/i18n/ui.ts` provide defaults. If the same option is defined in `sorapaper.ts`, the root config wins. Set `site.ogImage` to an absolute URL or a public asset path such as `/covers/sky.svg` for the default social sharing image. Blog posts automatically get generated Open Graph cards at `/og/posts/{slug}.svg` and `/og/posts/{slug}.png`; a post-level `ogImage` overrides the generated card used in metadata.

Article pages show a Creative Commons license at the end of the body. The default is CC BY 4.0; switch to the non-commercial variant in `sorapaper.ts`:

```ts
article: {
  license: "cc-by-nc-4.0"
}
```

Supported values are `cc-by-4.0` and `cc-by-nc-4.0`. Existing configurations that omit `article` continue to use CC BY 4.0.

Set `site.base` when deploying under a subdirectory. For example, GitHub Pages project sites usually need:

```ts
site: {
  url: "https://username.github.io",
  base: "/repo-name"
}
```

Use `base: "/"` for root-domain deployments. SoraPaper applies this base path to internal links, public assets, RSS, sitemap metadata, Pagefind search assets and generated Open Graph image URLs.

### Footer status and registrations

Set `footer.startedAt` to show a live site-runtime counter in the footer. It is updated every second in the browser. ICP and public-security registration details are optional and are hidden until configured:

```ts
footer: {
  startedAt: "2024-01-01T00:00:00+08:00",
  icp: {
    number: "京ICP备12345678号"
  },
  publicSecurity: {
    number: "京公网安备11010802000001号",
    href: "https://beian.mps.gov.cn/",
    icon: "/assets/beian-gongan.png"
  }
}
```

The ICP number is linked to [MIIT filing](https://beian.miit.gov.cn/). The default public-security icon is bundled at `public/assets/beian-gongan.png`; you may override `icon` with the version provided for your registration. Use the exact registration link supplied by the public-security filing platform. Both approved registration numbers should remain visible in the website footer.

Article pages include a quiet share panel. Readers can copy the canonical link, use the native system share sheet when supported, download the generated SVG or PNG card, share the link to X, Weibo or Telegram, and scan a WeChat QR code. WeChat custom in-app share metadata still requires the official WeChat JS-SDK and a signed server endpoint, so the theme uses a QR fallback by default.

The main visual system lives in `src/styles/global.css`. Use the CSS variables there for new components instead of hard-coded colors, shadows and radii.

Social icons live in `public/assets/social`. Author links in `sorapaper.ts` are matched by `label` or optional `icon`, for example `GitHub`, `Email`, `X`, `WeChat`, `Bilibili`, `Discord`, `Telegram`, `LinkedIn`, `Instagram`, `YouTube`, `RSS` and `Website`.

## Internationalization

Chinese is the default locale. Routes stay clean without `/zh` or `/en` prefixes; the language toggle stores the current locale in `localStorage.locale`.

Add `lang: zh` or `lang: en` to each post frontmatter. Use the same `translationKey` for translated versions of the same article. When a translated article is missing, the language toggle keeps readers on the current post and only changes the interface locale; the notice text can be customized with `ui.{locale}.article.translationUnavailable`.

## Design Handoff

See `design-handoff.md` for implementation rules and visual acceptance criteria.

For deeper architecture, extension and bug-fixing guidance, see `development-guide.md`.
