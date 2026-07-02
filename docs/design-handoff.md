# SoraPaper Design Handoff

This document keeps implementation aligned with the design direction.

For detailed architecture, development workflow, extension points and bug-fixing guidance, see `docs/development-guide.md`.

## Non-Negotiable Principles

- Content stays first. Article pages must remain calm, readable and fast.
- Visual atmosphere comes from soft gradients, glass cards, rounded corners and subtle decorative shapes.
- JavaScript stays optional and small. Static rendering is the default.
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
- Code blocks, blockquotes and tables must remain readable in both themes.

Archive and tags:

- Keep card rhythm consistent with homepage posts.
- Use soft page headers and generous spacing.

About and friends:

- Use the same glass card language.
- Avoid dense grids on mobile.

## Content Model

Posts are defined in `src/content.config.ts`. Required fields are `title`, `description` and `pubDate`. Optional fields provide richer theme behavior:

- `updatedDate`
- `tags`
- `category`
- `draft`
- `cover`
- `series`
- `toc`
- `pinned`

Friend links use the `friends` collection with `name`, `description`, `href`, optional `avatar` and `tags`.

## Acceptance Criteria

- The homepage should visually match the generated preview: airy spacing, soft gradient background, glass cards and content-first hierarchy.
- Lighthouse performance should target 90+ after installing dependencies and building.
- No horizontal scrolling at 375px viewport width.
- Light and dark modes must both pass practical readability checks.
- Search, RSS, archive, tag pages and post rendering should work without backend services.
- New visual components should not introduce hard-coded color palettes outside the token system.

## Optional Integrations

The theme is prepared for optional additions:

- Search: replace the current lightweight search with Pagefind for larger sites.
- Comments: integrate Giscus, Twikoo or Waline behind a config flag.
- Analytics: add privacy-friendly analytics only when explicitly enabled.
- Open Graph images: generate static OG cards from post metadata.
