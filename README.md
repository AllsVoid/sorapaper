# SoraPaper

> A calm, content-first Astro blog theme for personal writing.

[中文文档](README.zh-CN.md) · [Report a bug](https://github.com/AllsVoid/sorapaper/issues/new/choose) · [Request a feature](https://github.com/AllsVoid/sorapaper/issues/new/choose)

## Theme preview

![SoraPaper theme preview](public/theme-preview.jpg)

The repository includes a complete, editable preview site. Start it locally and open <http://localhost:4321>:

```bash
pnpm install
pnpm dev
```

Explore the included examples:

- Home, archive, tags, series, friends, and about pages.
- Extended Markdown examples at `/posts/markdown-extended-preview/`.
- Code, math, and Mermaid examples at `/posts/markdown-extended-code/`.
- Images, Live Photos, and galleries at `/posts/markdown-extended-images/`.
- Music and video embeds at `/posts/markdown-extended-media/`.

## Highlights

- **Static first.** Built with Astro, Content Collections, RSS, sitemap, and Pagefind-powered local search.
- **One place to customize.** Edit `sorapaper.ts` for site metadata, profile, colors, navigation, localized copy, feature flags, and more.
- **Dynamic social images.** Each post can generate its own SVG and PNG Open Graph card; the share panel also offers link copying, native sharing, downloads, and a WeChat QR fallback.
- **Rich writing tools.** Typed frontmatter, Shiki code windows, math, footnotes, callouts, tabs, details, encrypted blocks, image galleries, music, and video.
- **Mermaid without the usual cost.** Mermaid loads only for articles that use it, then renders when a diagram approaches the viewport. Source remains as a fallback, wide diagrams scroll on small screens, and diagrams open in an accessible enlarged view.
- **Media that feels native.** Image blocks support captions, credits, links, responsive layout, galleries, and progressive Live Photo playback.
- **Ready for readers.** Light and dark modes, four color schemes, Chinese/English UI, clean URLs, accessible controls, and responsive layouts.

## Quick start

Requires Node.js 22.12+ and pnpm 11+.

```bash
npm create sorapaper-astro-theme@latest my-site
cd my-site
pnpm install
pnpm dev
```

The command creates a standalone, editable site; it does not add the theme as
a runtime dependency. To develop directly from the repository instead, clone
it and follow the same install and development commands.

Then open <http://localhost:4321> and start with:

- `sorapaper.ts` — site-wide configuration.
- `src/content/blog/` — Markdown and MDX posts.
- `public/` — images, media, and other static assets.

Run the production checks before deploying:

```bash
pnpm run check
pnpm run test
pnpm run build
```

## Write a post

Create a Markdown file in `src/content/blog/`. This minimal frontmatter is enough:

```yaml
---
title: "A quiet note"
description: "A short description for readers and search engines."
pubDate: 2026-07-17
tags: ["Writing"]
---
```

Use the built-in Mermaid directive for diagrams:

```md
:::mermaid[Publishing flow]
flowchart LR
  Draft --> Build --> Publish
:::
```

See the [development guide](docs/development-guide.md) for all frontmatter fields, configuration options, and Markdown extensions.

## Write a travel entry

The travel MVP is enabled with `featureFlags.travel` in `sorapaper.ts`. Set `featureFlags.japanTravelMap` to `false` to hide the Japan map tab while keeping Japanese travel entries available in the content list. Add a `.md` or `.mdx` file under `src/content/travel/`; every entry needs a date range and at least one destination:

```yaml
---
title: "A spring between Suzhou and Guangzhou"
description: "A short introduction to the journey."
startDate: 2026-04-08
endDate: 2026-04-13
destinations:
  - name: "Suzhou"
    province: "Jiangsu"
    country: "CN"
    adminCode: "320500"
    # For destinations outside the bundled China administrative map, add coordinates:
    # coordinates: [135.7681, 35.0116]
---
```

Entries appear alongside normal posts on the home page. `/travel/` contains a local, static map that renders Chinese provinces represented by published `adminCode` values plus the provinces between them, preserving a continuous regional view; hover, focus, or tap a province to reveal its city boundaries and recorded cities. Its upper-left tabs separate domestic and international regions with local map data; each tab receives its own view and controls. Japanese destinations use local ADM1 prefecture boundaries, so the map highlights the matching prefecture by its Chinese `province` value and shows all of Japan, including remote islands. This deliberately omits Japan's city-level boundaries to keep the map data small. Destinations with `coordinates` are included as markers, so future international entries can extend the map without an external API. Hong Kong and Macau are rendered as separate, clickable regions on the main map, while Taiwan city and county boundaries are bundled locally in `src/data/maps/taiwan-cities.json`. The map has optional zoom controls when its selected area is broad. Regenerate its simplified province/city data with `node scripts/build-travel-map.mjs /path/to/ok_geo.csv src/data/maps/china-admin.json`. Regenerate Japan ADM1 + ADM2 data with `node scripts/build-japan-travel-map.mjs /path/to/geoBoundaries-JPN-ADM2.geojson src/data/maps/japan-admin.json /path/to/geoBoundaries-JPN-ADM1.geojson`. See [the travel PRD](docs/travel-prd.md) for interaction details.

Japan uses the single `src/data/maps/japan-admin.json` bundle. ADM2 municipality records remain available for matching destination `adminCode` values to their parent prefectures, but the map renders and interacts with ADM1 prefectures only. Selecting a prefecture opens its travel preview directly instead of expanding a municipality layer.

## Deploy

SoraPaper outputs a static site. Build it, then upload `dist/` to any static host:

```bash
pnpm run build
```

Before deployment, set the public address in `sorapaper.ts`:

```ts
site: {
  url: "https://example.com",
  base: "/"
}
```

For a GitHub Pages project site, use your account URL and repository path:

```ts
site: {
  url: "https://username.github.io",
  base: "/repository-name"
}
```

For Cloudflare Workers, keep `wrangler.jsonc` committed and deploy the built site with:

```bash
npx wrangler deploy
```

The Cloudflare build command is `pnpm run build`; the deployment command is `npx wrangler deploy`.

## Update safely

SoraPaper is a complete site starter, so keep your configuration and content separate from upstream changes.

1. Commit your site changes first.
2. Read [CHANGELOG.md](CHANGELOG.md).
3. Update the source, install the locked dependencies, and run checks:

```bash
git pull --ff-only
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
```

If you began with `npm create`, generate the new release in a temporary directory with `npm create sorapaper-astro-theme@latest /tmp/sorapaper-upstream`, then deliberately migrate your `sorapaper.ts`, `src/content/`, and `public/` changes. Do not overwrite a customized site without reviewing the release notes and diff.

## Bugs and feature requests

Use the GitHub forms so reports include the details needed to act on them:

- [Report a bug](https://github.com/AllsVoid/sorapaper/issues/new/choose) — include the version, environment, reproduction steps, expected result, and relevant logs.
- [Request a feature](https://github.com/AllsVoid/sorapaper/issues/new/choose) — explain the problem, proposed outcome, and alternatives considered.

Please search existing issues first and never include passwords, tokens, or other sensitive data.

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the local preview |
| `pnpm run check` | Run Astro type and content checks |
| `pnpm run test` | Run Markdown utility tests |
| `pnpm run build` | Create the production site in `dist/` |
| `pnpm run release:check` | Run the full npm release gate |

## More documentation

- [Development guide](docs/development-guide.md) — configuration, content model, and extension points.
- [Design handoff](docs/design-handoff.md) — visual and accessibility rules.
- [Changelog](CHANGELOG.md) — release notes and upgrade notes.
- [Legacy README](docs/legacy-readme.md) — the detailed configuration and extension reference kept from before the homepage was simplified.

## License

[MIT](LICENSE)
