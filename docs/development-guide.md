# SoraPaper 设计与开发文档

本文档面向后续开发人员和 LLM 维护者，用于在现有 SoraPaper Astro 主题基础上继续开发、修复 bug、替换视觉风格或接入新功能。

## 1. 项目目标

SoraPaper 是一个内容优先的 Astro 博客主题。它的设计基准是：

- Astro Paper 的简洁、轻量、长文阅读体验。
- Fuwari、Koharu、Yukina 一类主题的柔和渐变、玻璃卡片、圆角、低饱和氛围和轻装饰。
- 静态优先，默认少 JavaScript，不把个人博客做成重型前端应用。
- 可配置、可二次开发、可长期维护。

后续开发时不要偏离这几个方向。新增功能应优先保持主题轻量，视觉增强应服务于内容阅读，而不是抢占正文注意力。

## 2. 技术栈

当前项目使用：

- Astro：页面、路由、静态生成。
- Astro Content Collections：文章和友链内容建模。
- 主题内部 i18n：默认支持中文和英文，无可见语言前缀。
- MDX：允许文章中使用组件。
- CSS variables：设计 token、明暗主题、多主题色。
- 少量原生浏览器 JavaScript：Pagefind 搜索弹窗、主题切换、阅读进度条。
- RSS 和 sitemap Astro 集成。

当前 `package.json` 脚本：

```bash
npm install
npm run dev
npm run check
npm run build
npm run preview
```

注意：当前仓库依赖版本使用 `latest`，便于在真正开发环境中解析最新版本。正式发布主题前建议锁定版本并提交 lockfile。

## 3. 目录结构

```text
.
├─ astro.config.mjs
├─ package.json
├─ sorapaper.ts
├─ tsconfig.json
├─ README.md
├─ docs/
│  ├─ design-handoff.md
│  └─ development-guide.md
├─ public/
│  ├─ assets/
│  │  └─ social/
│  ├─ avatar.svg
│  ├─ favicon.svg
│  ├─ covers/
│  └─ friends/
└─ src/
   ├─ components/
   ├─ config/
   ├─ content/
   ├─ layouts/
   ├─ lib/
   ├─ pages/
   ├─ styles/
   └─ content.config.ts
```

关键目录职责：

- `sorapaper.ts`：用户统一配置入口，包括站点信息、默认 Open Graph 图片、作者、功能开关、Now 卡片和多语言页面文案。
- `src/config/theme.ts`：内部默认主题配置，会被 `sorapaper.ts` 强覆盖。
- `src/i18n/ui.ts`：内部默认本地化界面文案，会被 `sorapaper.ts.ui` 强覆盖。
- `src/styles/global.css`：全局样式和视觉 token，是视觉一致性的核心文件。
- `src/content.config.ts`：文章和友链的 Content Collections schema。
- `src/content/blog`：示例文章，支持 `.md` 和 `.mdx`。
- `src/content/friends`：友链内容。
- `src/lib/posts.ts`：文章查询、排序、slug、阅读时间、标签、归档、译文查找和相邻文章工具函数。
- `src/lib/paths.ts`：统一处理 `site.base`、站内链接、public 资源路径和绝对 URL。
- `src/i18n`：语言配置、路径工具和界面文案翻译表。
- `src/layouts`：页面骨架，主要是全站布局和文章布局。
- `src/components`：可复用 UI 组件。
- `public/assets/social`：社交栏 SVG 图标资源，侧栏会根据 author link 的 `label` 或 `icon` 自动匹配。
- `src/pages`：Astro 文件路由。

## 4. 架构说明

整体数据流：

```mermaid
flowchart TD
  RootConfig[sorapaper.ts] --> ThemeConfig[theme.ts]
  RootConfig --> I18nUi[i18n/ui.ts]
  ThemeConfig --> Layouts[Layouts]
  ThemeConfig --> Components[Components]
  ContentConfig[content.config.ts] --> ContentCollections[Content Collections]
  ContentCollections --> PostUtils[posts.ts]
  PostUtils --> Pages[Pages]
  Components --> Pages
  GlobalCSS[global.css] --> Layouts
  GlobalCSS --> Components
  Pages --> StaticOutput[Static Site Output]
```

页面路由：

- `/`：首页，展示 Hero、最新文章、侧栏信息。
- `/posts/[...slug]/`：文章详情页。
- `/archive/`：归档页，按年份分组。
- `/tags/`：标签总览。
- `/tags/[tag]/`：标签详情页。
- `/series/`：系列总览。
- `/series/[series]/`：按阅读顺序展示系列文章。
- `/about/`：关于页。
- `/friends/`：友链页。
- `/rss.xml`：RSS 输出。
- Pagefind 在生产构建后生成 `/pagefind/` 静态搜索资产，客户端按当前语言过滤。

路由本身保持无可见语言前缀。部署到子目录时，通过 `sorapaper.ts` 的 `site.base` 和 Astro `base` 输出到类似 `/repo-name/` 的路径。新增站内链接或 public 资源引用时，使用 `localizePath()`、`withBase()` 或 `absoluteUrl()`，不要直接写死根路径。

SEO 输出集中在 `src/layouts/BaseLayout.astro`：普通页面输出 canonical、Open Graph、Twitter Card 和默认分享图；文章页通过 `PostLayout.astro` 传入 article metadata，输出 `og:type=article`、发布时间、更新时间、标签和基于 `translationKey` 的 `hreflang` alternate links。RSS、Pagefind 搜索资产和 sitemap 使用 clean routes，并通过路径工具补齐 base path。

组件分层：

- Layout：`BaseLayout.astro`、`PostLayout.astro`。
- Navigation：`SiteHeader.astro`、`SiteFooter.astro`。
- Content：`PostCard.astro`、`ArticleHeader.astro`、`TableOfContents.astro`。
- Home：`HeroSection.astro`、`Sidebar.astro`。
- Interaction：`ThemeToggle.astro`、`SearchDialog.astro`、`ScrollProgress.astro`。

## 5. 视觉系统

视觉系统集中在 `src/styles/global.css`。后续新增组件时，优先使用已有 token，不要随手写散落的颜色、阴影和圆角。

核心 token：

```css
--bg
--bg-soft
--surface
--surface-strong
--border
--text
--muted
--primary
--secondary
--accent
--tag
--code-bg
--radius-sm
--radius-md
--radius-lg
--radius-xl
--shadow-card
--shadow-soft
--container
--article
```

主题风格规则：

- 大面积背景使用低饱和渐变。
- 内容卡片默认使用 `.glass`。
- 文章正文宽度应接近 `--article`，不要过宽。
- Hover 效果应轻微，避免大幅缩放、强阴影或高饱和颜色。
- 深色模式必须同步检查，不要只在浅色模式下调样式。

主题色通过 `html[data-scheme]` 控制，当前包括：

- `paper`
- `sakura`
- `moon`
- `ocean`

明暗模式通过 `html[data-theme="dark"]` 控制。

## 6. 内容模型

文章 collection 位于 `src/content.config.ts`：

```ts
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    slug: z.string().trim().min(1).optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default("Notes"),
    draft: z.boolean().default(false),
    cover: imageMeta.optional(),
    ogImage: z.string().optional(),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    toc: z.boolean().default(true),
    pinned: z.boolean().default(false)
  })
});
```

推荐文章 frontmatter：

```yaml
---
title: "文章标题"
description: "稳定的 SEO 描述，会用于页面 meta description"
excerpt: "更自然的展示摘要，会优先显示在列表、搜索、RSS 和自动生成的 OG 图中"
slug: "astro-theme-design" # 可选：自定义文章 URL，必须唯一
lang: zh
translationKey: astro-theme-design
pubDate: 2026-07-02
updatedDate: 2026-07-03
tags: ["Astro", "Design"]
category: "Frontend"
draft: false
cover:
  src: "/covers/sky.svg"
  alt: "封面图描述"
ogImage: "/og/custom-card.png"
series: "Astro Theme"
seriesOrder: 1
pinned: true
toc: true
---
```

Markdown 扩展：

- 文章支持 `:::note`、`:::info`、`:::tips`、`:::warning`、`:::success` 和 `:::error` 提示块。
- 提示块由 `remark-directive` 解析，并通过 `src/lib/markdown/remark-callouts.mjs` 转换为 `<aside class="callout callout-{type}">`。
- 可使用 `:::warning[自定义标题]` 覆盖默认标题。
- `tip` 是 `tips` 的兼容别名。
- 文章支持 `:::details[标题]` 折叠块，默认输出原生 `<details>` / `<summary>`；可用 `{open=true}` 默认展开。
- 文章支持 `::::tabs` 包裹多个 `:::tab[标题]`，输出纯 CSS 标签页，不依赖客户端 JavaScript。
- 文章可以继续使用标准 Markdown 图片语法 `![alt](src)`。
- 代码块由 Astro/Shiki 在构建时高亮，`src/lib/markdown/code-blocks.mjs` 负责解析 fence meta、标记行号/高亮/diff，并在 rehype 阶段包裹为 Apple 风格代码窗口。支持 `title="..."`、`url="..."`、`linkText="..."`、`mark:1,3-4`、`ins:1`、`del:2`、`noLineNumbers` 和 `lineNumbers=false`。
- `sorapaper.ts` 的 `codeBlocks.copyButton` 和 `codeBlocks.lineNumbers` 控制默认复制按钮与行号显示；旧文章无需迁移，未写 meta 的代码块会显示语言名。
- 文章支持 `:::encrypted[公开标题]{password="页面输入密码"}` 局部加密块，用 `:::encrypted` 和 `:::` 包围要加密的内容。`src/lib/markdown/remark-encrypted.mjs` 负责识别 directive 并保留块内 Markdown 继续渲染，`src/lib/markdown/rehype-encrypted.mjs` 在 rehype 管线末尾把最终 HTML 用 AES-256-GCM 加密。构建时密码优先来自 directive 的 `password`/`passphrase` 属性，也可来自 `SORAPAPER_ENCRYPTION_KEYS` JSON、`SORAPAPER_ENCRYPTION_KEY_{KEY}` 或默认 `SORAPAPER_ENCRYPTION_KEY`；文章页仅在正文包含 `:::encrypted` 时加载 `EncryptedBlockLoader.astro`，浏览器端使用 Web Crypto 的 PBKDF2-SHA-256 派生密钥后解锁。`password` 不会输出到最终 HTML，但会留在 Markdown 源文件和仓库历史中；真正私密的密码应使用环境变量。同一 `key` 的多个块会在一次输入后一起尝试解锁。不要把敏感标题放在加密块内，因为 Astro 的 `headings`/TOC 可能在块解锁前暴露标题文本。
- 数学公式由 `remark-math` 解析，并通过 `rehype-katex` 在构建时渲染。行内公式使用 `$E = mc^2$`，块级公式使用 `$$...$$`，公式内容为 LaTeX 数学语法。
- 音乐和视频引用由 `src/lib/markdown/remark-media-embeds.mjs` 在构建期转换。推荐使用标准叶子 directive：`::music{provider="netease" ref="19723756"}` 和 `::video{provider="youtube" ref="M7lc1UVf-VE"}`。`provider` 指定平台，统一的 `ref` 保存平台原生引用；网易云与 QQ 默认是单曲，也支持 `type="playlist"`、`type="album"` 和 `type="artist"`。Spotify 使用 `track:ID` / `album:ID` / `playlist:ID`，Bilibili 支持 `BV…` / `av…` / `ep…`。
- 网易云、QQ 与 `provider="local"` 由 `MusicPlayerLoader.astro` 按文章内容加载 MetingJS/APlayer；本地音乐使用 `src` 和必填的 `title`，可选 `artist`、`cover` 与内联 `lyric`，站内文件应放在 `public/`。播放器保留原始链接作为无 JavaScript或初始化失败时的 fallback。Spotify 与视频仍输出官方 HTTPS iframe、`loading="lazy"`、受限 `allow` 权限和严格 referrer policy。
- 解析器也支持平台完整 URL 写法，并兼容旧的 `:::music URL:::`、`:::video URL:::` 和空容器形式。它只接受已知域名、合法平台引用或安全的 HTTP(S)/站内本地媒体路径；缺少必要属性或无法识别的输入会让构建失败。短链不会在构建期联网解析，平台映射应继续集中在本地适配器中。
- Mermaid 图表使用 `:::mermaid[可选标题]` directive，由 `src/lib/markdown/remark-mermaid.mjs` 转换为带源码 fallback 的 `<figure class="mermaid-block">`；文章页仅在原文包含 `:::mermaid` 时挂载 `MermaidLoader.astro`，动态加载官方 `mermaid` 包并按当前 CSS token 渲染 SVG。Mermaid 使用 `securityLevel: "strict"`，主题只承诺静态图表语法，不支持图表源定义的点击事件、不安全 HTML 或交互扩展；宽图在移动端保持原尺寸并可横向滚动，点击、触摸或键盘激活可打开 SVG 放大预览。
- 脚注由 `remark-gfm` 解析，使用标准 Markdown footnote 语法：正文写 `[^1]`，底部写 `[^1]: 脚注内容`。脚注样式集中在 `src/styles/global.css` 的 `.footnotes` 和 `data-footnote-*` 选择器。
- 文章的 `h2`、`h3` 和 `h4` 标题会复用 Astro 生成的稳定 `id`；文章页脚本在最终 DOM 中追加锚点链接，点击锚点会跳转并复制完整小节 URL。
- 文章支持 `:::img{src="..." alt="..."}` 图片块，用于图注、缩放、链接、图片来源和实况图片；`scale` 表示相对正文宽度的百分比，默认 `100`。`live` 非空时，构建阶段输出静态图片 fallback 和 LivePhotosKit 初始化数据，文章页由 `LivePhotoLoader.astro` 按需加载 Apple LivePhotosKit JS。Live Photo 素材应使用同一实况照片导出的 JPEG + MOV 配对；已验证可播放素材中 JPEG 的 `Apple:MediaGroupUUID` 与 MOV 的 `Keys:ContentIdentifier` 一致，MOV 还包含 `NRT Metadata` / `mebx` 元数据轨道和 `StillImageTime`。
- 文章支持 `::::gallery[可选标题]{layout="carousel" rounded="true"}` 包裹多个 `:::img` 图片块。`layout` 可选 `carousel`（默认普通轮播）或 `stack`（扑克牌式层叠）；文章页仅在原文包含 `:::gallery` 时挂载 `GalleryLoader.astro`，支持按钮、圆点、方向键、触控拖动和横向滚轮。`rounded` 默认是 `true`，设为 `false` 时 gallery 及其内部图片使用直角；独立 `:::img` 也支持同一属性。无 JavaScript 时所有图片按文档顺序显示，嵌套图片仍保留图注、链接、来源和 Live Photo 能力。
- 扩展语法预览文章位于 `src/content/blog/markdown-extended-preview.md`，新增或调整扩展语法时同步更新。
- 新增其他 `:::name` 扩展时，优先放在本地 remark 插件中，并同步更新 README、预览文章与文章样式。

Live Photo 元数据排查命令：

```bash
exiftool -a -G1 -s -MediaGroupUUID -ContentIdentifier -StillImageTime photo.jpg live.mov
ffprobe -hide_banner -show_format -show_streams -of json live.mov
```

维护约定：

- `title`、`description`、`pubDate` 是必填字段。
- `excerpt` 是可选展示摘要；首页卡片、文章头部、搜索结果、RSS 和自动生成的 OG 图会优先使用它，没有时回退到 `description`。
- `lang` 当前支持 `zh` 和 `en`，用于文章过滤、搜索索引和 RSS 输出。
- 同一篇文章的不同语言版本应使用相同的 `translationKey`，便于后续实现文章互译跳转。
- `draft: true` 的文章不会进入列表和详情路由。
- `cover.alt` 必须可读，避免空 alt 描述用于重要封面。
- 文章默认生成 `/og/posts/{slug}.svg` 和 `/og/posts/{slug}.png` Open Graph 图片；`ogImage` 可手动覆盖元信息使用的图片，未指定时文章页会使用 PNG 生成图。
- 文章页分享面板位于 `src/components/PostShare.astro`，支持复制链接、系统分享、下载 SVG/PNG、分享到 X/微博/Telegram，以及微信二维码。微信自定义分享需要 JS-SDK、签名接口和可信域名，不作为静态主题默认能力。
- 标签命名要统一，例如不要混用 `frontend`、`Frontend`、`front-end`。
- `toc: false` 可用于短文或无标题层级文章。

友链 collection：

```yaml
---
name: "Astro"
description: "The web framework for content-driven websites."
href: "https://astro.build"
avatar: "/friends/astro.svg"
tags: ["Framework", "Frontend"]
---
```

## 7. i18n 实现说明

核心文件：

- `src/i18n/config.ts`：定义 `defaultLocale`、`locales`、语言名称、路径生成和语言切换工具。
- `src/i18n/ui.ts`：定义中文和英文默认界面文案，并用 `sorapaper.ts.ui` 覆盖。
- `src/layouts/BaseLayout.astro`：在首屏前读取 URL `?lang=` 或 `localStorage.locale`，设置 `html[data-locale]`。
- `src/components/SiteHeader.astro`：提供语言图标按钮，切换当前 locale；文章页会跳到对应译文 slug。

路由策略：

- 页面 URL 不带 `/zh` 或 `/en` 前缀。
- 首页、归档、标签、关于、友链等公共页面同时渲染中文和英文区块，通过 `html[data-locale]` 显示当前语言。
- 文章详情页按文章文件 slug 生成无前缀路径，语言切换时通过 `getTranslatedPost(post, posts, targetLocale)` 根据 `translationKey` 跳转到对应译文文章；没有译文时不跳转，只切换 `html[data-locale]` 和 `localStorage.locale`，并显示 `ui.{locale}.article.translationUnavailable` 提示。
- 文章列表通过 `getPublishedPosts(locale)` 按 frontmatter 的 `lang` 过滤。文章页使用同语言文章列表和 `getAdjacentPosts(posts, currentPost)` 生成上一篇/下一篇导航。
- 搜索索引输出所有文章，客户端按当前 `data-locale` 过滤结果。

路径工具：

- `localizePath(locale, path)`：生成无语言前缀但包含 `site.base` 的内部链接，参数用于兼容调用位置。
- `switchLocalePath(targetLocale, currentPath)`：生成带 `?lang=` 的兼容切换链接，主要用于非 JS fallback。
- `getLocaleFromParams(Astro.params)`：保留给未来动态语言路由兼容，当前主要使用 `localStorage.locale`。
- `withBase(path)` 和 `absoluteUrl(path)`：用于 public 资源、RSS、sitemap、OG 图和分享链接，避免子目录部署时路径丢失 base。

新增语言时需要：

1. 在 `src/i18n/config.ts` 增加 locale 类型。
2. 在 `sorapaper.ts` 增加完整界面文案。
3. 在 `src/content.config.ts` 扩展 `lang` enum。
4. 添加对应语言文章内容。
5. 检查导航、搜索、RSS、归档、标签页是否支持新语言显示和过滤。

## 8. 页面实现说明

### 首页

入口：`src/pages/index.astro`

职责：

- 调用 `getPublishedPosts(locale)` 获取当前语言文章。
- 调用 `getPinnedPosts(locale)` 获取当前语言置顶文章。
- 调用 `getAllTags()` 生成标签侧栏。
- 组合 `HeroSection`、`PostCard` 和 `Sidebar`。

修改首页布局时注意：

- 桌面端保持文章列表 + 右侧栏。
- 移动端侧栏必须下沉。
- Hero 可以有视觉装饰，但不能影响首屏阅读层级。

### 文章页

入口：`src/pages/posts/[...slug].astro`

职责：

- 使用 `getStaticPaths()` 为已发布文章生成静态路由。
- 使用 `render(post)` 渲染 Markdown/MDX。
- 将 `post` 和 `headings` 传入 `PostLayout`。

布局：`src/layouts/PostLayout.astro`

注意：

- TOC 依赖 `render(post)` 返回的 `headings`。
- `post.data.toc` 控制是否显示目录。
- 正文样式由 `.article-content` 提供。

### 归档与标签

入口：

- `src/pages/archive.astro`
- `src/pages/tags/index.astro`
- `src/pages/tags/[tag].astro`

工具函数：

- `getArchiveGroups(posts)`
- `getAllTags(posts)`

新增筛选、分页或分类页面时，优先在 `src/lib/posts.ts` 扩展工具函数，避免每个页面重复实现。

### 关于与友链

入口：

- `src/pages/about.astro`
- `src/pages/friends.astro`

关于页读取 `themeConfig.author`。友链页读取 `friends` collection。

## 9. 核心工具函数

文件：`src/lib/posts.ts`

已有函数：

- `getPublishedPosts(locale)`：读取指定语言的非草稿文章，按发布时间倒序。
- `getPinnedPosts(locale)`：返回指定语言的置顶文章。
- `getPostSlug(post)`：优先使用 frontmatter 的 `slug`，否则从 content entry id 得到 slug。
- `getPostHref(post)`：生成无语言前缀的文章链接。
- `getReadingTime(body, locale)`：按中英文混合内容粗略计算本地化阅读时间。
- `formatDate(date, locale)`：按当前语言格式化日期。
- `getAllTags(posts)`：生成标签计数和路径安全 slug；`getTagSlug(tag)` 会保留中文等 Unicode 字母数字字符，并规范化路径敏感字符。
- `getArchiveGroups(posts)`：按年份分组文章。

常见扩展：

- 分类页：新增 `getAllCategories(posts)`。
- 系列页：新增 `getSeriesGroups(posts)`。
- 分页：新增 `paginatePosts(posts, page, pageSize)`。
- 相邻文章：新增 `getAdjacentPosts(posts, currentPost)`。

## 10. 交互功能

### 明暗模式

组件：`src/components/ThemeToggle.astro`

机制：

- 使用 `localStorage.theme` 保存用户选择。
- `BaseLayout.astro` 内联脚本在页面加载前读取设置，减少主题闪烁。
- 深色样式由 `:root[data-theme="dark"]` 提供。

修改建议：

- 新增样式时必须同时考虑深色模式。
- 不要在组件里硬编码深色颜色，优先扩展 token。

### 多主题色

组件：`src/components/SiteHeader.astro`

机制：

- 点击色彩按钮循环 `paper`、`sakura`、`moon`、`ocean`。
- 当前值保存在 `localStorage.scheme`。
- CSS 通过 `:root[data-scheme="..."]` 修改 `--primary`、`--secondary`、`--accent`。

### 搜索

组件：`src/components/SearchDialog.astro`

索引：生产构建后生成的 `/pagefind/` 静态资产。

机制：

- `PostLayout.astro` 将文章内容标记为 Pagefind 索引主体，并写入语言过滤字段。
- 客户端打开搜索弹窗时懒加载 Pagefind API，并按当前 `html[data-locale]` 过滤结果。
- Pagefind 提供全文索引、相关性排序与命中片段高亮。
- 搜索始终启用，不通过 `featureFlags` 配置。

### 阅读进度条

组件：`src/components/ScrollProgress.astro`

机制：

- 监听 `scroll` 和 `resize`。
- 通过 `scaleX()` 更新顶部进度条。

如果页面出现性能问题，优先检查这里和搜索组件的事件监听。

## 11. 样式开发规范

新增组件时建议：

1. 先确认是否已有组件可以复用。
2. 使用 `.glass`、`.pill`、`.container`、`.section-title`、`.muted` 等全局工具类。
3. 局部样式写在 Astro 组件 `<style>` 中。
4. 颜色、圆角、阴影、宽度使用 token。
5. 移动端断点优先参考已有组件的 `680px`、`760px`、`780px`、`860px`、`940px`、`1080px`。

避免：

- 在多个组件里复制相同复杂样式。
- 为单个按钮写完全不同的交互语言。
- 使用高饱和背景破坏柔和风格。
- 让正文容器过宽。
- 让装饰元素遮挡正文或产生横向滚动。

## 12. 常见二次开发任务

### 修改站点信息

优先编辑根目录 `sorapaper.ts`：

- 站点名称：`name`
- 站点描述：`description`
- 作者信息：`author`
- Now 卡片：`now`
- 功能开关：`featureFlags`
- 文章许可协议：`article.license`，可选 `cc-by-4.0`（默认）或 `cc-by-nc-4.0`。
- 导航文案。
- 首页 Hero 文案。
- 页面标题、搜索文案、文章页文案和页脚文案。

`src/config/theme.ts` 和 `src/i18n/ui.ts` 是内部默认值文件。只有在维护主题默认行为时才修改它们；普通用户配置应写在 `sorapaper.ts`。

### 新增文章

在 `src/content/blog` 下创建 `.md` 或 `.mdx` 文件，填写 frontmatter。开发前运行：

```bash
npm run check
```

### 新增页面

在 `src/pages` 下创建 Astro 文件。建议：

- 使用 `BaseLayout` 包裹页面。
- 使用 `container` 保持宽度一致。
- 页面头部样式参考 `archive.astro` 或 `tags/index.astro`。

### 新增卡片组件

在 `src/components` 下创建组件。建议：

- 使用 `glass` 作为基础视觉。
- 圆角使用 `--radius-md` 或 `--radius-lg`。
- hover 只做轻微 `translateY` 或边框色变化。

### 新增社交链接或图标

社交栏配置优先写在 `sorapaper.ts` 的 `author.links`：

```ts
links: [
  { label: "GitHub", href: "https://github.com/" },
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "WeChat", href: "#wechat" },
  { label: "My Site", href: "https://example.com", icon: "website" }
]
```

侧栏会先读取 `icon`，没有 `icon` 时根据 `label` 自动匹配 `public/assets/social/*.svg`。常见内置图标包括 `github`、`email`、`x`、`wechat`、`bilibili`、`discord`、`telegram`、`linkedin`、`instagram`、`youtube`、`facebook`、`gitlab`、`rss`、`website`、`mastodon` 和 `juejin`。

新增平台时，把同名 SVG 放到 `public/assets/social/<icon>.svg`，再在 `sorapaper.ts` 中使用 `icon: "<icon>"`。

### 新增评论系统

建议创建：

```text
src/components/Comments.astro
src/lib/comments.ts
```

并在 `themeConfig.featureFlags.comments` 控制启用。不要默认加载第三方脚本。

### 新增 Open Graph 图片

建议创建专门的 OG 生成路由或脚本，不要把 OG 逻辑塞进文章页布局。OG 样式应复用主题 token。

## 13. Bug 修复指南

### 页面构建失败

优先检查：

- frontmatter 是否符合 `src/content.config.ts`。
- 日期是否能被 `z.coerce.date()` 解析。
- `cover` 是否包含 `src` 和 `alt`。
- MDX 中是否使用了未导入组件。

命令：

```bash
npm run check
npm run build
```

### 文章不显示

检查：

- `draft` 是否为 `true`。
- 文件是否在 `src/content/blog`。
- 文件后缀是否是 `.md` 或 `.mdx`。
- 是否缺少必填 frontmatter。

### 标签页 404

检查：

- 标签大小写是否混乱。
- `getAllTags()` 生成的 slug 是否和链接一致。
- 标签中是否包含仅由符号构成的内容；`getTagSlug()` 会将空白、路径分隔符、查询/锚点和其他路径敏感字符统一规范为连字符。

### 搜索无结果

检查：

- 搜索索引是否能访问：`/pagefind/pagefind.js`。
- 当前 `html[data-locale]` 是否符合预期。
- 文章是否为草稿。
- 搜索内容是否在文章正文、标题或摘要中。
- 浏览器控制台是否有 Pagefind 加载或查询错误。

### 主题切换闪烁

检查：

- `BaseLayout.astro` 的内联脚本是否仍在 `<head>` 中。
- 是否有组件在加载后覆盖了 `data-theme`。
- 是否引入了不受 token 控制的硬编码背景色。

### 移动端横向滚动

优先检查：

- 装饰元素是否超出容器。
- `pre`、`table`、图片是否没有设置 overflow 或 max-width。
- 新增组件是否写了固定宽度。

### 深色模式不可读

检查：

- 是否使用了硬编码浅色背景或深色文字。
- 新组件是否依赖 `--surface`、`--text`、`--muted`。
- 代码块、引用块、标签是否复用全局样式。

## 14. LLM 维护指南

如果由 LLM 继续开发，请遵守：

- 先读 `README.md`、`docs/design-handoff.md`、本文档和相关组件，再修改。
- 不要修改计划文件。
- 不要随意引入大型依赖。新增依赖前说明原因和替代方案。
- 不要把所有功能塞进单个组件，优先保持现有分层。
- 修改视觉时优先改 token，而不是逐个组件打补丁。
- 修改内容模型时同步更新示例文章和本文档。
- 修 bug 时先定位最小影响范围，不要顺手重构无关页面。
- 每次改动后至少运行 `npm run check`；发布前运行 `npm run build`。
- 如果当前环境没有 Node/npm，应在最终说明中明确无法验证。

LLM 推荐排查顺序：

1. 读报错栈或用户截图。
2. 定位对应路由文件。
3. 查看它依赖的组件和 `src/lib/posts.ts`。
4. 检查 content schema 和示例内容。
5. 做最小修复。
6. 运行 check/build。
7. 总结改动、验证结果和剩余风险。

## 15. 验收清单

功能验收：

- 首页可打开，文章列表正常。
- 文章页可打开，Markdown/MDX 渲染正常。
- 归档页、标签页、关于页、友链页可打开。
- `/rss.xml` 可访问。
- `/pagefind/pagefind.js` 可访问。
- 搜索弹窗可打开并返回结果。
- 明暗模式可切换并持久化。
- 主题色可切换并持久化。
- 阅读进度条工作正常。

视觉验收：

- 首页接近预览图：柔和渐变、玻璃卡片、清晰层级。
- 正文宽度适合长文阅读。
- 代码块、引用、表格、图片不破版。
- 375px 移动端无横向滚动。
- 深色模式对比度可读。
- Hover 和动效克制。

工程验收：

- `npm run check` 通过。
- `npm run build` 通过。
- Lighthouse Performance 目标 90+。
- 新增样式使用 token。
- 新增内容符合 Content Collections schema。
- 文档同步更新。

## 16. 后续路线建议

短期：

- 锁定依赖版本并提交 lockfile。
- 为搜索补键盘快捷键。
- 给文章页补上一篇/下一篇。
- 给 SEO 增加 canonical、Open Graph 图片和 Twitter Card。

中期：

- 增加分类页和系列文章页。
- 增加评论适配层，支持 Giscus/Twikoo/Waline。
- 增加主题配置文档页面。
- 增加示例站点截图和部署指南。

长期：

- 抽成可复用 Astro theme template。
- 增加主题 CLI 初始化脚本。
- 建立视觉回归截图测试。
- 为内容 schema 做迁移说明和版本化。
