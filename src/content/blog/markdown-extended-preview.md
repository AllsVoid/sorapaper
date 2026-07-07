---
title: "Markdown 扩展语法预览"
description: "用于预览 SoraPaper 当前支持的 Markdown 扩展语法。"
lang: zh
translationKey: markdown-extended-preview
pubDate: 2026-07-07
tags: ["Markdown", "预览"]
category: "主题功能"
draft: false
pinned: false
toc: true
---

这篇文章用于集中预览 SoraPaper 的 Markdown 扩展语法。后续新增或调整扩展语法时，优先更新这篇文章，方便在真实文章页里检查渲染效果。

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

## 后续扩展区

后续如果增加折叠块、标签页、数学公式、Mermaid 或代码块增强等语法，可以继续在这里追加对应示例。
