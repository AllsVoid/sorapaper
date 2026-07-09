---
title: "Build a Minimal Blog with Astro and Markdown"
description: "How I built this blog with Astro, MDX, and a love for simplicity."
excerpt: "A look at how SoraPaper keeps writing close to Astro content collections while using typed frontmatter, design tokens and Markdown extensions for a calm reading experience."
lang: en
translationKey: astro-theme-design
pubDate: 2026-07-02
updatedDate: 2026-07-02
tags: ["Astro", "Frontend", "Design"]
category: "Frontend"
draft: false
cover:
  src: "/covers/sky.svg"
  alt: "A quiet sky illustration with clouds and soft blue gradients."
pinned: true
toc: true
---

Astro is a good foundation for a personal theme because it keeps content close to the platform. The theme can feel polished without becoming a heavy client application.

## Design Principles

SoraPaper follows three principles:

- Keep long-form reading calm and centered.
- Use soft decoration only where it supports orientation.
- Make every visual decision configurable through a small token system.

## Content First

The homepage can be expressive, but the article page should stay quiet. Typography, spacing, code blocks, images and tables deserve more care than ornamental effects.

> The visual layer should feel present, but never louder than the writing.

## Implementation Notes

The theme uses Astro Content Collections for typed frontmatter, plain CSS variables for design tokens, and optional integrations for search, comments and analytics.
