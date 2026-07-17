---
title: "用 Astro 和 Markdown 构建极简博客"
description: "记录如何用 Astro、MDX 和简洁设计构建 SoraPaper 主题。"
excerpt: "从内容集合、类型化 frontmatter、设计 token 到 Markdown 扩展，记录 SoraPaper 如何在静态优先的基础上保持柔和、可读和易维护。"
lang: zh
translationKey: astro-theme-design
pubDate: 2026-07-02
updatedDate: 2026-07-02
tags: ["Astro", "前端", "设计"]
category: "前端"
series: "构建 SoraPaper"
seriesOrder: 1
draft: false
cover:
  src: "/covers/sky.svg"
  alt: "云朵、天空和柔和蓝色渐变组成的安静插画。"
pinned: true
toc: true
---

Astro 很适合作为个人主题的基础，因为它让内容保持接近平台本身。主题可以足够精致，但不必变成一个沉重的客户端应用。

## 设计原则

SoraPaper 遵循三个原则：

- 长文阅读保持安静、居中和舒适。
- 视觉装饰只用于辅助氛围和方向感。
- 重要视觉决策都通过小而清晰的 token 系统配置。

## 内容优先

首页可以更有表达力，但文章页应该克制。排版、间距、代码块、图片和表格，比装饰动效更值得投入。

> 视觉层应该被感受到，但不应该比文字本身更响。

## 实现笔记

主题使用 Astro Content Collections 管理类型化 frontmatter，使用 CSS variables 管理设计 token，并将搜索、评论和统计都设计为可选集成。
