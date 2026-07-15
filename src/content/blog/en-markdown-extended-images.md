---
title: "Markdown Extensions Preview (3): Images and Galleries"
description: "A preview of SoraPaper's image blocks, Live Photos, carousel galleries and stacked galleries."
lang: en
translationKey: markdown-extended-images
pubDate: 2026-07-07
tags: ["Markdown", "Preview"]
category: "Theme Features"
series: "Markdown Extensions Preview"
seriesOrder: 3
draft: false
pinned: false
toc: true
---

This article focuses on regular images, image blocks with captions, Live Photos and two gallery layouts.

## Image Blocks

Regular images can still use standard Markdown syntax:

```md
![Soft sky](/covers/sky.svg)
```

![Soft sky](/covers/sky.svg)

When you need a caption, scaling or a Live Photo asset, use the `:::img` image block. `scale` is the image width as a percentage of the article width and defaults to `100`.

:::img{src="/covers/sky.svg" alt="Soft sky illustration" caption="A soft sky illustration for previewing image blocks." scale="82" credit="SoraPaper"}
:::

An image block with a `live` URL keeps its static cover as a fallback and loads LivePhotosKit JS on the article page only when needed. In a real use case, `src` should point to the still photo and `live` should point to the MOV video exported from the same Live Photo.

```md
:::img{src="/photos/livephoto-test.jpg" live="/photos/livephoto-test.mov" alt="Live Photo test asset" caption="A Live Photo test example." scale="68" ratio="16/9" photoTime="0"}
:::
```
:::img{src="/photos/livephoto-test.jpg" live="/photos/livephoto-test.mov" alt="Live Photo test asset" caption="A Live Photo test example." scale="68" ratio="16/9" photoTime="0"}
:::

## Galleries

Galleries use `::::gallery` to wrap multiple existing `:::img` blocks. `layout="carousel"` creates a regular carousel, while `layout="stack"` creates a deck-like stacked switcher. `rounded` defaults to `true`; set it to `false` for regular sharp-cornered rectangles. Both layouts support buttons, dots, keyboard arrow keys, touch dragging and horizontal-wheel scrolling.

### Regular Carousel

::::gallery[Soft Scene Carousel]{layout="carousel"}
:::img{src="/covers/sky.svg" alt="Soft sky illustration" caption="Sky"}
:::
:::img{src="/covers/sunset.svg" alt="Pink and purple sunset illustration" caption="Sunset"}
:::
:::img{src="/covers/room.svg" alt="Quiet room illustration" caption="Room"}
:::
::::

### Deck-like Stack

::::gallery[Sharp-cornered Scene Set]{layout="stack" rounded="false"}
:::img{src="/covers/room.svg" alt="Quiet room illustration" caption="Room"}
:::
:::img{src="/covers/sky.svg" alt="Soft sky illustration" caption="Sky"}
:::
:::img{src="/covers/sunset.svg" alt="Pink and purple sunset illustration" caption="Sunset"}
:::
::::
