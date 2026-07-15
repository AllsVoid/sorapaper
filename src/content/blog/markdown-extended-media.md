---
title: "Markdown 扩展语法预览（四）：音乐与视频"
description: "预览 SoraPaper 对网易云、QQ 音乐、Spotify、Bilibili 与 YouTube 的媒体引用。"
lang: zh
translationKey: markdown-extended-media
pubDate: 2026-07-07
tags: ["Markdown", "预览"]
category: "主题功能"
series: "Markdown 扩展语法预览"
seriesOrder: 4
draft: false
pinned: false
toc: true
---

本篇集中展示音乐和视频引用。推荐使用标准叶子 directive，通过统一的 `provider` 和 `ref` 指定平台与平台原生引用。

## 网易云音乐

::music{provider="netease" ref="2690549700"}

## QQ 音乐

::music{provider="qq" ref="0024KfFh4NPjaf"}

## 网易云歌单

::music{provider="netease" type="playlist" ref="14334890278"}

本地音乐可引用 `public/` 下的音频和封面文件：

```md
::music{provider="local" src="/media/song.mp3" title="本地音乐" artist="作者" cover="/media/cover.webp"}
```

## Spotify

::music{provider="spotify" ref="track:11dFghVXANMlKmJXsNCbNl"}

## Bilibili

::video{provider="bilibili" ref="BV1B7411m7LV"}

## YouTube

::video{provider="youtube" ref="M7lc1UVf-VE"}

