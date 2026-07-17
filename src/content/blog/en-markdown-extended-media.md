---
title: "Markdown Extensions Preview (4): Music and Video"
description: "A preview of SoraPaper's media embeds for NetEase Cloud Music, QQ Music, Spotify, Bilibili and YouTube."
lang: en
translationKey: markdown-extended-media
pubDate: 2026-07-07
tags: ["Markdown", "Preview"]
category: "Theme Features"
series: "Markdown Extensions Preview"
seriesOrder: 4
draft: false
pinned: false
toc: true
---

This article focuses on music and video embeds. The recommended approach is to use standard leaf directives with a consistent `provider` and `ref` for each platform's native reference.

## NetEase Cloud Music

::music{provider="netease" ref="2690549700"}

## QQ Music

::music{provider="qq" ref="0024KfFh4NPjaf"}

## NetEase Cloud Music Playlist

::music{provider="netease" type="playlist" ref="14334890278"}

Local music can reference audio and cover files under `public/`:

```md
::music{provider="local" src="/media/song.mp3" title="Local song" artist="Artist" cover="/media/cover.webp"}
```

## Spotify

::music{provider="spotify" ref="track:11dFghVXANMlKmJXsNCbNl"}

## Bilibili

::video{provider="bilibili" ref="BV1B7411m7LV"}

## YouTube

::video{provider="youtube" ref="M7lc1UVf-VE"}
