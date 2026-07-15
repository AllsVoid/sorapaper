---
title: "Markdown 扩展语法预览（三）：图片与画廊"
description: "预览 SoraPaper 的图片块、实况图片、轮播画廊与堆叠画廊。"
lang: zh
translationKey: markdown-extended-images
pubDate: 2026-07-07
tags: ["Markdown", "预览"]
category: "主题功能"
series: "Markdown 扩展语法预览"
seriesOrder: 3
draft: false
pinned: false
toc: true
---

本篇集中展示普通图片、带图注的图片块、实况图片以及两种画廊布局。

## 图片块

普通图片仍然可以使用标准 Markdown 语法：

```md
![柔和天空](/covers/sky.svg)
```

![柔和天空](/covers/sky.svg)

需要图注、缩放或实况图片资源时，可以使用 `:::img` 图片块。`scale` 表示图片整体相对正文宽度的百分比，默认是 `100`。

:::img{src="/covers/sky.svg" alt="柔和天空插画" caption="一张用于预览图片块的柔和天空插画。" scale="82" credit="SoraPaper"}
:::

带 `live` 地址的图片块会保留静态封面作为 fallback，并在文章页按需加载 LivePhotosKit JS 播放配套视频。真实使用时，`src` 应指向静态照片，`live` 应指向同一张实况照片导出的 MOV 视频。

```md
:::img{src="/photos/livephoto-test.jpg" live="/photos/livephoto-test.mov" alt="实况照片测试素材" caption="实况图片测试示例。" scale="68" ratio="16/9" photoTime="0"}
:::
```
:::img{src="/photos/livephoto-test.jpg" live="/photos/livephoto-test.mov" alt="实况照片测试素材" caption="实况图片测试示例。" scale="68" ratio="16/9" photoTime="0"}
:::

## 画廊

画廊使用 `::::gallery` 包裹多个现有的 `:::img`。`layout="carousel"` 是普通轮播，`layout="stack"` 是扑克牌式堆叠切换；`rounded` 默认是 `true`，设为 `false` 时使用普通直角矩形；两者都支持按钮、圆点、键盘方向键、触控拖动和横向滚轮。

### 普通轮播

::::gallery[柔和场景轮播]{layout="carousel"}
:::img{src="/covers/sky.svg" alt="柔和天空插画" caption="天空"}
:::
:::img{src="/covers/sunset.svg" alt="粉紫色日落插画" caption="日落"}
:::
:::img{src="/covers/room.svg" alt="安静房间插画" caption="房间"}
:::
::::

### 扑克牌式堆叠

::::gallery[直角层叠场景图集]{layout="stack" rounded="false"}
:::img{src="/covers/room.svg" alt="安静房间插画" caption="房间"}
:::
:::img{src="/covers/sky.svg" alt="柔和天空插画" caption="天空"}
:::
:::img{src="/covers/sunset.svg" alt="粉紫色日落插画" caption="日落"}
:::
::::

