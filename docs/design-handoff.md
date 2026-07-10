# SoraPaper Design Handoff

This document keeps implementation aligned with the design direction.

For detailed architecture, development workflow, extension points and bug-fixing guidance, see `docs/development-guide.md`.

## Non-Negotiable Principles

- Content stays first. Article pages must remain calm, readable and fast.
- Visual atmosphere comes from soft gradients, glass cards, rounded corners and subtle decorative shapes.
- JavaScript stays optional and small. Static rendering is the default.
- Chinese and English experiences should stay structurally equivalent unless a page intentionally has locale-specific content.
- New UI must use design tokens from `src/styles/global.css`.

## Visual Tokens

Use these token categories instead of one-off values:

- Colors: `--bg`, `--bg-soft`, `--surface`, `--surface-strong`, `--text`, `--muted`, `--primary`, `--secondary`, `--accent`.
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`.
- Shadow: `--shadow-card`, `--shadow-soft`.
- Width: `--container`, `--article`.
- Fonts: `--font-sans`, `--font-serif`, `--font-mono`.

The default card treatment is `glass`: translucent surface, subtle border, blur and soft shadow.

## Page Requirements

Global layout:

- Main page containers should use the shared `--container` token and adapt to the viewport, targeting about 80% of desktop screen width instead of fixed pixel caps.
- Small screens may use near-full-width containers to preserve readability and avoid overly narrow content.

Homepage:

- Sticky glass navigation.
- Large expressive hero with chips and decorative art.
- Latest post list on the left.
- Profile, tags and now cards on the right.
- Sidebar moves below posts on tablet and mobile.

Article page:

- Centered title, description, tags, date and reading time.
- Body width should remain close to `--article`.
- Floating TOC appears only on wide screens.
- Code blocks should use the Apple-style window chrome, readable Shiki colors, accessible copy controls, optional line numbers, highlighted lines and restrained diff colors in both themes.
- Math formulas should use KaTeX rendering, keep inline formulas aligned with surrounding text, and allow wide block formulas to scroll horizontally without widening the article.
- Footnotes should remain quiet, readable and inside the article width, with clear back references and visible target states.
- Heading anchors should stay subtle, appear on hover or focus on larger screens, remain keyboard accessible, and avoid shifting heading layout.
- Standard Markdown images and `:::img` image blocks should stay centered, responsive and visually quiet; image block scaling should remain relative to the article body width. Live Photo blocks must keep a stable aspect ratio, show the still image without JavaScript, and only add subtle playback affordance.
- Markdown callouts must use a softly tinted title bar with a small standalone icon, keep the body on a plain article surface, distinguish note, info, tips, warning, success and error with restrained colors, and remain readable in both themes. Details and tabs should keep the same quiet article-surface treatment and work without client-side JavaScript.
- Mermaid diagrams should render inside a quiet article-surface card, use existing color tokens for light and dark themes, keep wide diagrams scrollable within the article width, and preserve readable source fallback when JavaScript is unavailable or rendering fails.
- Generated Open Graph images should reuse the SoraPaper visual language: soft gradients, glass-like card surfaces, readable title hierarchy, restrained decorative shapes and stable 1200x630 social-card dimensions.
- The article share panel should stay compact and optional, use the same glass card language, keep buttons keyboard accessible, and provide a QR fallback for WeChat instead of assuming platform-specific JavaScript SDK access.

Archive and tags:

- Archive should use a compact timeline layout instead of homepage post cards, with year markers, optional thumbnails, concise metadata and clipped summaries.
- Use soft page headers and generous spacing.
- Tags page uses a weighted typography cloud: larger, stronger and more saturated words indicate higher post counts, while hover/focus can reveal the exact count.

About and friends:

- Use the same glass card language.
- Avoid dense grids on mobile.

## Content Model

Posts are defined in `src/content.config.ts`. Required fields are `title`, `description` and `pubDate`. Optional fields provide richer theme behavior:

- `lang`
- `translationKey`
- `updatedDate`
- `tags`
- `category`
- `draft`
- `cover`
- `series`
- `toc`
- `pinned`

Friend links use the `friends` collection with `name`, `description`, `href`, optional `avatar` and `tags`.

Localized UI lives on clean routes without `/zh` or `/en` prefixes. The language toggle stores the current locale in `localStorage.locale`.

## Acceptance Criteria

- The homepage should visually match the generated preview: airy spacing, soft gradient background, glass cards and content-first hierarchy.
- Lighthouse performance should target 90+ after installing dependencies and building.
- No horizontal scrolling at 375px viewport width.
- Light and dark modes must both pass practical readability checks.
- Search, RSS, archive, tag pages and post rendering should work without backend services.
- Search and RSS should remain available on clean routes, e.g. `/search.json` and `/rss.xml`, with search results filtered by the current locale.
- New visual components should not introduce hard-coded color palettes outside the token system.

## Optional Integrations

The theme is prepared for optional additions:

- Search: replace the current lightweight search with Pagefind for larger sites.
- Comments: integrate Giscus, Twikoo or Waline behind a config flag.
- Analytics: add privacy-friendly analytics only when explicitly enabled.
- Open Graph images: generate static OG cards from post metadata.
