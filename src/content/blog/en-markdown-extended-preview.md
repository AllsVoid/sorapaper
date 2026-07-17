---
title: "Markdown Extensions Preview (1): Content Blocks and Interactions"
description: "A preview of SoraPaper's quote, notice, details, tabs and encrypted content blocks."
lang: en
translationKey: markdown-extended-preview
pubDate: 2026-07-07
tags: ["Markdown", "Preview"]
category: "Theme Features"
series: "Markdown Extensions Preview"
seriesOrder: 1
draft: false
pinned: false
toc: true
---

This series previews the Markdown extensions currently supported by SoraPaper. This article focuses on block components that help organize content and interactive information.

## Blockquotes

Standard Markdown blockquotes begin with `>` and work well for excerpts, opinions or source notes.

> The visual layer should feel present, but never louder than the writing.

Blockquotes also support multiple paragraphs and lists:

> The first paragraph holds the main point.
>
> - Keep the content clear.
> - Let the visual layer serve the reading experience.

## Notice Blocks

Notice blocks use the `:::` syntax consistently. The current types are `note`, `info`, `tips`, `warning`, `success` and `error`.

### Note

:::note
This is a regular note block for extra context, background or a light reminder.
:::

### Info

:::info
This information block provides additional context for readers.
:::

### Tips

:::tips
This tips block is useful for suggestions, experience-based advice or recommended practices.
:::

### Warning

:::warning
This warning block calls attention to risks or prerequisites.
:::

### Success

:::success
This success block is suitable for completed work, recommended results or positive feedback.
:::

### Error

:::error
This error block is useful for failures, dangerous operations or problems that need immediate correction.
:::

## Custom Titles

Add a title in square brackets after the type to override the default title.

:::warning[Before You Deploy]
Before publishing, make sure the site URL, RSS, sitemap and Open Graph image are configured correctly.
:::

## Markdown Inside Blocks

Notice blocks can still contain common Markdown such as lists, links, inline code and code blocks.

:::info[Content Inside a Block]
You can put a list inside a notice block:

- Regular paragraphs are supported.
- So are **bold text**, links and `inline code`.
- Code blocks are supported too.

```ts
const syntax = ":::info";
console.log(syntax);
```
:::


## Details Blocks

Details blocks are useful for supplementary notes, longer explanations or content that does not need to be expanded by default.

:::details[Expand for More]
Here is the content of a details block. It can contain regular paragraphs, lists and code blocks.

- Good for optional information.
- Uses the browser's native `details` / `summary` semantics.
- Requires no additional client-side JavaScript.
:::

:::details[Expanded by Default]{open=true}
This details block is expanded by default. It can highlight supplementary content while keeping the same structure.
:::

## Tabs

Tabs use `::::tabs` to wrap multiple `:::tab[title]` blocks and are useful for showing different versions of the same content.

::::tabs
:::tab[Syntax]
A tabs group consists of one `::::tabs` container and multiple `:::tab[title]` child blocks. Each `tab` must be closed independently.
:::
:::tab[Result]
The first tab is selected by default. Switching tabs requires no client-side JavaScript, and the content remains in the article flow.
:::
:::tab[Tip]
Each `tab` can still contain regular Markdown such as **bold text**, lists and code blocks.
:::
::::

## Encrypted Block Syntax

Encrypted blocks wrap content with `:::encrypted` and `:::`. The `password` is entered to unlock the page, and is not written to the final HTML after the build.

````md
:::encrypted[Private Note]{password="Password hint"}
This content enters the page in encrypted form after the build and is unlocked in the browser after entering the password.

```ts
const secret = "encrypted at build time";
```
:::
````

:::encrypted[Private Note]{password="Password hint"}
This content enters the page in encrypted form after the build and is unlocked in the browser after entering the password.
:::
