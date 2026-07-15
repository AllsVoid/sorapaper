---
title: "Markdown 扩展语法预览（一）：内容块与交互"
description: "预览 SoraPaper 的引用、提示、折叠、标签页与加密内容块。"
lang: zh
translationKey: markdown-extended-preview
pubDate: 2026-07-07
tags: ["Markdown", "预览"]
category: "主题功能"
series: "Markdown 扩展语法预览"
seriesOrder: 1
draft: false
pinned: false
toc: true
---

这个系列用于预览 SoraPaper 当前支持的 Markdown 扩展语法。本篇集中展示适合组织文章内容和交互信息的块级组件。

## 引用块

标准 Markdown 引用使用 `>` 开头，适合展示摘录、观点或来源说明。

> 视觉层应该被感受到，但不应该比文字本身更响。

引用块也支持多段内容和列表：

> 第一段用于放置主要观点。
>
> - 保持内容清晰。
> - 让视觉服务于阅读。

## 提示块

提示块统一使用 `:::` 语法。当前支持 `note`、`info`、`tips`、`warning`、`success` 和 `error`。

### Note

:::note
这是普通备注块，适合补充说明、上下文或轻量提示。
:::

### Info

:::info
这是信息提醒块，用于提供额外信息。
:::

### Tips

:::tips
这是技巧提示块，适合放建议、经验或更推荐的做法。
:::

### Warning

:::warning
这是警告提醒块，用于提示读者注意风险或前置条件。
:::

### Success

:::success
这是成功状态块，适合展示已完成、推荐结果或正向反馈。
:::

### Error

:::error
这是错误提醒块，适合展示失败、危险操作或需要立即修正的问题。
:::

## 自定义标题

在类型后追加方括号，可以覆盖默认标题。

:::warning[部署前确认]
发布前请确认站点 URL、RSS、sitemap 和 Open Graph 图片都已经配置正确。
:::

## 块内 Markdown

提示块内部仍然可以写常见 Markdown 内容，例如列表、链接、行内代码和代码块。

:::info[块内内容示例]
你可以在提示块里放列表：

- 支持普通段落。
- 支持 **加粗**、链接和 `inline code`。
- 支持代码块。

```ts
const syntax = ":::info";
console.log(syntax);
```
:::


## 折叠块

折叠块适合放补充说明、较长的解释或默认不需要展开的内容。

:::details[展开查看更多]
这里是折叠块内容。它可以包含普通段落、列表和代码块。

- 适合放可选信息。
- 使用浏览器原生 `details` / `summary` 语义。
- 不需要额外客户端 JavaScript。
:::

:::details[默认展开示例]{open=true}
这个折叠块默认展开，可以用于需要突出但又希望保持结构一致的补充内容。
:::

## 标签页

标签页使用 `::::tabs` 包裹多个 `:::tab[标题]`，适合展示同一内容的不同版本。

::::tabs
:::tab[写法]
标签页由一个 `::::tabs` 容器和多个 `:::tab[标题]` 子块组成。实际使用时，每个 `tab` 都需要独立闭合。
:::
:::tab[效果]
标签页默认选中第一项。切换标签不需要客户端 JavaScript，内容会保持在文章流中。
:::
:::tab[提示]
每个 `tab` 内部仍然可以书写普通 Markdown，例如 **加粗文字**、列表和代码块。
:::
::::

## 加密块写法

加密块使用 `:::encrypted` 和 `:::` 包围内容。`password` 是页面解锁时要输入的密码，构建后不会写入最终 HTML。

````md
:::encrypted[私密笔记]{password="密码提示"}
这段内容会在构建后以密文形式进入页面，并在浏览器中输入密码后解锁。

```ts
const secret = "encrypted at build time";
```
:::
````

:::encrypted[私密笔记]{password="密码提示"}
这段内容会在构建后以密文形式进入页面，并在浏览器中输入密码后解锁。
:::
