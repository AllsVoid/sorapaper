---
title: "Markdown 扩展语法预览（二）：代码、公式与图表"
description: "预览 SoraPaper 的代码块、数学公式、脚注、标题锚点与 Mermaid 图表。"
lang: zh
translationKey: markdown-extended-code
pubDate: 2026-07-07
tags: ["Markdown", "预览"]
category: "主题功能"
series: "Markdown 扩展语法预览"
seriesOrder: 2
draft: false
pinned: false
toc: true
---

本篇集中展示技术文章常用的代码、数学公式、脚注、标题锚点和 Mermaid 图表。

## 代码块

代码块会自动渲染为 Apple 风格窗口。可以通过 fence meta 设置文件名、源链接、行高亮、diff 行。

```js title="hello.js" url="https://example.com" linkText="查看源码" mark:1,3
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

## 数学公式

行内公式使用单个美元符号，例如 $E = mc^2$，会和正文自然排在同一行。

块级公式使用双美元符号：

$$
\int_0^1 x^2 dx = \frac{1}{3}
$$

## 脚注

脚注适合放补充说明、引用来源或延伸阅读。正文里使用脚注引用[^syntax]，脚注内容会集中显示在文章底部。

[^syntax]: 这是一个脚注示例，使用标准 Markdown footnote 语法。

## 标题锚点

二级到四级标题会自动带有锚点。将鼠标悬停在标题上，或用键盘聚焦标题旁的 `#`，即可复制当前小节链接。

### 锚点子标题

这个三级标题用于检查目录跳转、悬停显示和复制链接行为。


## Mermaid 图表

Mermaid 图表使用 `:::mermaid` 指令。标题是可选的；如果浏览器禁用 JavaScript 或图表解析失败，页面会保留源码作为 fallback。

:::mermaid[文章渲染流程]
flowchart TD
  Markdown[Markdown 文章] --> Directive[remark-directive]
  Directive --> Mermaid[remark-mermaid]
  Mermaid --> Fallback[源码 fallback]
  Fallback --> Loader[MermaidLoader]
  Loader --> Diagram[SVG 图表]
:::

:::mermaid[时序图]
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
