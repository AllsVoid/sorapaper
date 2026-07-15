---
title: "Markdown Extensions Preview (2): Code, Math and Diagrams"
description: "A preview of SoraPaper's code blocks, mathematical formulas, footnotes, heading anchors and Mermaid diagrams."
lang: en
translationKey: markdown-extended-code
pubDate: 2026-07-07
tags: ["Markdown", "Preview"]
category: "Theme Features"
series: "Markdown Extensions Preview"
seriesOrder: 2
draft: false
pinned: false
toc: true
---

This article focuses on code, mathematical formulas, footnotes, heading anchors and Mermaid diagrams commonly used in technical writing.

## Code Blocks

Code blocks are rendered automatically as Apple-style windows. Fence meta can set a filename, source link, highlighted lines and diff lines.

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

## Mathematical Formulas

Inline formulas use a single dollar sign, such as $E = mc^2$, and sit naturally on the same line as the surrounding text.

Block formulas use double dollar signs:

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

## Footnotes

Footnotes are useful for supplementary notes, source references or further reading. Add a footnote reference in the body with [^syntax], and the note will be collected at the bottom of the article.

[^syntax]: This is an example footnote using standard Markdown footnote syntax.

## Heading Anchors

Second- through fourth-level headings automatically receive anchors. Hover over a heading, or focus the `#` beside it with the keyboard, to copy the current section link.

### Anchor Subheading

This third-level heading helps check table-of-contents navigation, hover visibility and link-copy behavior.


## Mermaid Diagrams

Mermaid diagrams use the `:::mermaid` directive. A title is optional; if JavaScript is disabled in the browser or diagram parsing fails, the source remains available as a fallback.

:::mermaid[Article Rendering Flow]
flowchart TD
  Markdown[Markdown article] --> Directive[remark-directive]
  Directive --> Mermaid[remark-mermaid]
  Mermaid --> Fallback[Source fallback]
  Fallback --> Loader[MermaidLoader]
  Loader --> Diagram[SVG diagram]
:::

:::mermaid[Sequence Diagram]
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop HealthCheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
:::
