# AGENTS.md

This file defines the working rules for AI agents and maintainers contributing to the **SoraPaper** Astro theme.

SoraPaper is a content-first Astro theme with a calm visual style, static-first architecture, low client-side JavaScript, and user-facing configuration centered in `sorapaper.ts`.

Follow this file as the canonical repository instruction. If a more specific `AGENTS.md` exists in a subdirectory, follow both, with the nearest file taking precedence for local rules.

---

## 1. Working Principles

For every change:

1. Read the relevant code, configuration, and documentation.
2. Identify the affected layer before editing.
3. Make the smallest correct change.
4. Preserve backward compatibility where practical.
5. Update tests, examples, and documentation when needed.
6. Run applicable checks.
7. Review the final diff before reporting completion.

Do not edit blindly, rewrite unrelated code, or claim checks passed without running them.

---

## 2. Files to Read First

General context:

- `README.md`
- `docs/development-guide.md`
- `docs/design-handoff.md`
- `package.json`
- `astro.config.mjs`
- `sorapaper.ts`

Configuration and i18n:

- `src/config/theme.ts`
- `src/config/types.ts`
- `src/config/merge.ts`
- `src/i18n/ui.ts`
- `src/i18n/config.ts`

Content and posts:

- `src/content.config.ts`
- `src/content/blog/`
- `src/content/friends/`
- `src/lib/posts.ts`

Pages and UI:

- `src/pages/`
- `src/layouts/BaseLayout.astro`
- `src/layouts/PostLayout.astro`
- `src/components/`
- `src/styles/global.css`

Read only the files relevant to the current task, but inspect existing implementations before creating new ones.

---

## 3. Repository Responsibilities

| Responsibility | Location |
|---|---|
| User-facing theme configuration | `sorapaper.ts` |
| Astro build settings | `astro.config.mjs` |
| Internal theme defaults | `src/config/theme.ts` |
| Config types | `src/config/types.ts` |
| Config merge behavior | `src/config/merge.ts` |
| Built-in localized copy | `src/i18n/ui.ts` |
| Locale helpers | `src/i18n/config.ts` |
| Content schemas | `src/content.config.ts` |
| Post helpers | `src/lib/posts.ts` |
| Routes | `src/pages/` |
| Shared layout | `src/layouts/BaseLayout.astro` |
| Post layout | `src/layouts/PostLayout.astro` |
| Reusable components | `src/components/` |
| Global tokens and Markdown styles | `src/styles/global.css` |
| User documentation | `README.md` |
| Architecture and contributor guidance | `docs/development-guide.md` |
| Visual acceptance rules | `docs/design-handoff.md` |

Do not create a second source of truth for an existing responsibility.

---

## 4. Configuration Rules

`sorapaper.ts` is the user-facing configuration entry.

Use it for:

- site metadata;
- author information;
- avatar and social links;
- Now card;
- feature flags;
- color schemes;
- navigation labels;
- hero text;
- page, search, footer, and article copy.

Internal defaults live in:

- `src/config/theme.ts`
- `src/i18n/ui.ts`

Current merge rules:

- objects merge recursively;
- arrays are replaced by root configuration;
- primitive values are replaced by root configuration.

These rules are part of the public contract. Do not change them silently.

When adding a public config field:

1. Update `src/config/types.ts`.
2. Add the internal default.
3. Expose an example in `sorapaper.ts`.
4. Update all consumers.
5. Update README.
6. Consider old user configurations.
7. Run type and build checks.

Do not ask normal theme users to edit internal default files.

---

## 5. Routing and i18n

Keep routes without visible locale prefixes.

Current routes include:

- `/`
- `/archive/`
- `/tags/`
- `/tags/[tag]/`
- `/posts/[...slug]/`
- `/about/`
- `/friends/`
- `/rss.xml`
- `/search.json`

Language behavior:

- Chinese is the default locale.
- The active locale is stored in `localStorage.locale`.
- It is reflected on `html[data-locale]`.
- Shared pages may use `[data-lang]` visibility rules.
- Translated posts should share the same `translationKey`.

When adding translated content:

- set `lang: zh` or `lang: en`;
- reuse the same `translationKey`;
- keep language-specific tags consistent;
- handle missing translations safely.

Do not hard-code visible copy in reusable components when it belongs in configuration or i18n.

---

## 6. Astro and Component Rules

Prefer:

- static Astro pages;
- Content Collections;
- `.astro` components;
- build-time processing;
- CSS variables;
- small, focused components.

Add client-side JavaScript only when interaction requires it.

When JavaScript or hydration is necessary:

- keep it isolated;
- use the narrowest hydration strategy;
- prefer `client:visible` or `client:idle` over `client:load`;
- do not hydrate an entire page for a small interaction.

Before creating a component:

1. Search `src/components/`.
2. Inspect similar components.
3. Reuse or extend existing behavior when possible.

Avoid:

- duplicated components;
- page-specific assumptions in shared components;
- large components mixing unrelated responsibilities;
- hidden global side effects;
- unnecessary UI frameworks or dependencies.

---

## 7. Content and Post Rules

When adding or changing a post field:

1. Update `src/content.config.ts`.
2. Update `src/lib/posts.ts` if behavior changes.
3. Update related layouts and components.
4. Update example frontmatter.
5. Update README and development documentation.
6. Check existing posts without the new field.
7. Check RSS and search output when relevant.
8. Run validation.

Do not silently rename frontmatter fields.

Prefer optional fields with safe defaults when possible.

---

## 8. Visual Rules

Preserve the SoraPaper style:

- content first;
- soft gradients;
- glass-like cards;
- large rounded corners;
- gentle shadows;
- calm typography;
- restrained animation;
- comfortable reading width;
- low client-side JavaScript.

Reuse tokens from `src/styles/global.css`, including:

- `--bg`
- `--bg-soft`
- `--surface`
- `--surface-strong`
- `--border`
- `--text`
- `--muted`
- `--primary`
- `--secondary`
- `--accent`
- `--tag`
- `--radius-*`
- `--shadow-*`
- `--container`
- `--article`

Do not:

- hard-code a second color system in components;
- add heavy animations;
- widen article pages excessively;
- redesign unrelated areas;
- hide duplicated markup with CSS when it should be removed.

Check visual changes in:

- light and dark mode;
- mobile and desktop;
- Chinese and English;
- long text and missing optional content.

Update `docs/design-handoff.md` when the visual contract changes.

---

## 9. Accessibility and SEO

UI changes must preserve:

- semantic HTML;
- keyboard access;
- visible focus states;
- heading hierarchy;
- accessible labels;
- meaningful image `alt` text;
- sufficient contrast;
- reduced-motion support.

When changing routes, layouts, or post metadata, check:

- page title;
- description;
- canonical URL;
- Open Graph metadata;
- language metadata;
- RSS;
- search index;
- sitemap behavior if configured.

Do not duplicate metadata already generated by existing layouts.

---

## 10. Development Workflow

Before editing:

1. Inspect `git status`.
2. Identify whether the task affects config, i18n, content, routes, layouts, components, styles, build, or docs.
3. Read the nearest implementation.
4. Search for similar behavior.
5. Identify compatibility and documentation impact.
6. Avoid touching unrelated files.

### Dependency Decision Flow

Use this flow before deciding whether a new feature should rely on a third-party library or be implemented locally.

Start: implement a new feature.

1. Is this feature part of SoraPaper's core value?

   Core value includes the content authoring model, Markdown extensions, article rendering, theme configuration, static-first output, reading experience, accessibility, SEO behavior and the calm visual system.

   If yes:

   - If the feature requires full control over implementation details, performance, security or user experience, prefer implementing it locally, or use a low-level library behind a local wrapper.
   - If full control is not required, a third-party library is acceptable, but it must be wrapped behind a local adapter so the theme owns its public contract.

   If no, continue.

2. Is there a mature, actively maintained and widely used third-party library?

   If yes:

   - Prefer the third-party library.
   - Check package size, dependency tree, license, release activity, security posture and Astro/static-site compatibility before adding it.

   If no:

   - Consider implementing the feature locally.
   - Consider lowering the feature scope if the full feature would be costly or fragile.

3. Would a local implementation be error-prone or have many edge cases?

   Examples include parsing, syntax highlighting, diagrams, math rendering, date/time logic, sanitization, media metadata, search ranking and browser compatibility.

   If yes:

   - Prefer a proven library.
   - Keep the integration narrow and test representative edge cases.

   If no:

   - A local implementation is acceptable, especially when it is small, readable and consistent with existing SoraPaper patterns.

4. Is the third-party library too heavy, too invasive or unsuitable?

   Unsuitable packages include packages that:

   - add large client-side JavaScript for a small feature;
   - require global runtime side effects;
   - fight Astro's static-first architecture;
   - force a second design system;
   - have incompatible licensing;
   - make SSR/build output unpredictable;
   - are poorly maintained or have unresolved security issues.

   If yes:

   - Prefer a lightweight local implementation.
   - Or choose a smaller/lower-level package.
   - Or gate the feature behind a narrow boundary and lazy loading.

   If no:

   - Introducing the library is acceptable.

5. Is the solution likely to be replaced later?

   If yes:

   - Introduce the library behind an adapter, wrapper component, build helper or local module.
   - Keep package-specific APIs out of content schemas, public config and broad shared components.

   If no:

   - Direct usage is acceptable, but keep it centralized.
   - Document the dependency's role and the reason it was chosen.

Implementation requirements when adding a dependency:

- Prefer existing dependencies and local helpers before adding a new package.
- Add the dependency with the current package manager only.
- Do not manually edit lockfiles.
- Update README and development documentation when users or maintainers need to know about the feature.
- Add examples to representative content when the feature affects Markdown or authoring.
- Use lazy loading or build-time processing when possible.
- Run `pnpm run check` and `pnpm exec astro build`.
- Report package-size or build warnings honestly.

During implementation:

- keep changes focused;
- update types with implementation;
- update tests with behavior;
- prefer existing patterns;
- avoid speculative refactoring;
- avoid repository-wide formatting;
- do not overwrite unrelated user changes;
- do not edit plan files unless explicitly asked.

Do not manually edit generated files such as:

- `.astro/`
- `dist/`
- generated type files
- generated RSS or search output

---

## 11. Documentation Rules

Update `README.md` when users need to know about:

- setup;
- commands;
- configuration;
- frontmatter;
- features;
- deployment;
- migration.

Update `docs/development-guide.md` when changing:

- architecture;
- extension points;
- content flow;
- config flow;
- debugging or contributor workflow.

Update `docs/design-handoff.md` when changing:

- visual language;
- design tokens;
- reusable UI rules;
- acceptance criteria.

Update `AGENTS.md` when the repository structure or required development process changes.

If a meaningful change does not require documentation updates, explain why existing docs remain accurate.

---

## 12. Validation

Use repository scripts from `package.json`.

Preferred commands:

```bash
pnpm run check
pnpm exec astro build
```

Run additional scripts when available and relevant:

```bash
pnpm run lint
pnpm run test
pnpm run format:check
```

Minimum expectations:

| Change | Required checks |
|---|---|
| Config or types | check and build |
| Content schema | check, build, representative content |
| Component or layout | check, build, visual review |
| Route | check, build, route review |
| i18n | check, build, both locales |
| Style | check, build, responsive and theme review |
| Build config | check, build, deployment behavior |

PowerShell fallback when pnpm requires CI mode:

```powershell
$env:CI="true"; pnpm run check
$env:CI="true"; pnpm exec astro build
```

Known notes:

- Astro or Zod deprecation messages may be non-blocking warnings.
- If `.astro/content.d.ts` causes a generated-file write error, remove `.astro/` and retry.
- Never commit `.astro/`.

When a check fails:

1. Determine whether the current change caused it.
2. Fix related failures.
3. Re-run the failed command.
4. Re-run the full applicable validation.
5. Report unrelated failures accurately.

---

## 13. Git and File Safety

Before finishing, review:

```bash
git status
git diff --check
git diff --stat
git diff
```

Check for:

- unrelated changes;
- generated files;
- duplicated code;
- debug output;
- secrets;
- accidental lockfile changes;
- stale implementations.

Do not:

- commit unless explicitly asked;
- revert unrelated changes;
- force-push or rewrite history unless asked;
- switch package managers;
- manually edit lockfiles;
- commit `node_modules/`, `.astro/`, or `dist/`;
- upgrade unrelated dependencies;
- silently introduce breaking changes.

---

## 14. Common Task Checklist

### Add site copy

1. Update `sorapaper.ts`.
2. Add types if needed.
3. Add internal defaults.
4. Update all locales.
5. Update docs if the config shape changed.
6. Run check and build.

### Add a page

1. Add the route under `src/pages/`.
2. Use `BaseLayout`.
3. Use config or i18n for visible text.
4. Reuse existing components.
5. Update navigation and defaults if built in.
6. Update docs.
7. Check locales, themes, metadata, and responsive behavior.
8. Run validation.

### Add a post field

1. Update the content schema.
2. Update helpers and consumers.
3. Add example frontmatter.
4. Preserve old content where possible.
5. Update docs.
6. Check RSS and search if relevant.
7. Run validation.

### Add a feature flag

1. Add the type.
2. Add the default.
3. Expose it in `sorapaper.ts`.
4. Gate behavior at the narrowest boundary.
5. Test enabled and disabled states.
6. Update docs.
7. Run validation.

---

## 15. Completion Checklist

Before declaring completion:

- [ ] Relevant code and documentation were read.
- [ ] The change is focused.
- [ ] Existing patterns were reused.
- [ ] Config, types, defaults, and consumers remain synchronized.
- [ ] i18n keys and locales remain synchronized.
- [ ] Content schema and helpers remain synchronized.
- [ ] Backward compatibility was considered.
- [ ] Tests or representative validation were added when applicable.
- [ ] `pnpm run check` was run or accurately reported.
- [ ] Production build was run or accurately reported.
- [ ] Visual behavior was reviewed when applicable.
- [ ] Mobile, desktop, light, dark, zh, and en were considered.
- [ ] Documentation remains accurate.
- [ ] Generated files are not included.
- [ ] The final diff contains no unrelated changes.

---

## 16. Final Response Format

Report:

### Summary

What changed.

### Main Files

Which files matter and why.

### Behavior and Compatibility

User-visible behavior, config impact, and migration needs.

### Documentation

What documentation changed, or why no update was required.

### Validation

Commands actually executed and their results.

Example:

```text
PASS     pnpm run check
PASS     pnpm exec astro build
NOT RUN  visual regression tests — not configured
```

### Remaining Risks

Warnings, limitations, pre-existing failures, or follow-up work.

Never mark an unexecuted command as passed.
