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