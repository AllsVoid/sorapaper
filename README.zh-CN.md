# SoraPaper

> 面向个人写作的、安静且内容优先的 Astro 博客主题。

[English](README.md) · [提交 Bug](https://github.com/AllsVoid/sorapaper/issues/new/choose) · [功能建议](https://github.com/AllsVoid/sorapaper/issues/new/choose)

## 主题预览

仓库内置了一套可直接编辑的完整预览站点。启动后访问 <http://localhost:4321>：

```bash
pnpm install
pnpm dev
```

可以浏览以下示例：

- 首页、归档、标签、系列、友链和关于页面。
- 内容块与交互示例：`/posts/markdown-extended-preview/`。
- 代码、公式和 Mermaid 示例：`/posts/markdown-extended-code/`。
- 图片、实况图片与画廊示例：`/posts/markdown-extended-images/`。
- 音乐与视频示例：`/posts/markdown-extended-media/`。

## 特性

- **静态优先。** 基于 Astro 与 Content Collections，内置 RSS、站点地图和 Pagefind 本地搜索。
- **集中配置。** 在 `sorapaper.ts` 中设置站点信息、个人资料、配色、导航、多语言文案和功能开关。
- **动态分享图片。** 每篇文章可生成 SVG、PNG Open Graph 卡片；分享面板支持复制链接、系统分享、下载卡片和微信二维码兜底。
- **丰富的写作能力。** 类型化 frontmatter、Shiki 代码窗口、公式、脚注、提示块、标签页、折叠块、加密内容、画廊、音乐与视频。
- **按需 Mermaid。** 仅含图表的文章才加载 Mermaid，并在图表接近视口时渲染；保留源码 fallback，移动端可横向查看，且支持无障碍的放大预览。
- **更自然的图片体验。** 图片支持题注、来源、链接和响应式布局；画廊与 Apple Live Photo 均为渐进增强。
- **面向读者。** 明暗模式、四套配色、中英文界面、干净路由、无障碍控件和响应式布局。

## 快速开始

需要 Node.js 22.12+ 与 pnpm 11+。

```bash
git clone https://github.com/AllsVoid/sorapaper.git my-site
cd my-site
pnpm install
pnpm dev
```

打开 <http://localhost:4321> 后，优先修改：

- `sorapaper.ts`：全站配置。
- `src/content/blog/`：Markdown 与 MDX 文章。
- `public/`：图片、媒体等静态资源。

部署前运行：

```bash
pnpm run check
pnpm run test
pnpm run build
```

## 写一篇文章

在 `src/content/blog/` 创建 Markdown 文件，最小 frontmatter 如下：

```yaml
---
title: "一则安静的笔记"
description: "给读者和搜索引擎的简短说明。"
pubDate: 2026-07-17
tags: ["写作"]
---
```

使用内置 Mermaid 指令绘制图表：

```md
:::mermaid[发布流程]
flowchart LR
  草稿 --> 构建 --> 发布
:::
```

完整的 frontmatter、配置和 Markdown 扩展，请参阅[开发指南](docs/development-guide.md)。

## 部署

SoraPaper 构建为静态站点。执行构建后，将 `dist/` 上传到任意静态托管服务：

```bash
pnpm run build
```

部署前，请在 `sorapaper.ts` 设置正式地址：

```ts
site: {
  url: "https://example.com",
  base: "/"
}
```

GitHub Pages 的项目站点通常需要账户地址和仓库路径：

```ts
site: {
  url: "https://username.github.io",
  base: "/repository-name"
}
```

Cloudflare Workers 保留提交的 `wrangler.jsonc`，构建完成后执行：

```bash
npx wrangler deploy
```

Cloudflare 的构建命令为 `pnpm run build`，部署命令为 `npx wrangler deploy`。

## 安全更新

SoraPaper 是完整的站点起始项目。请将自己的配置和内容与上游更新分开处理。

1. 先提交自己的站点改动。
2. 阅读 [CHANGELOG.md](CHANGELOG.md)。
3. 更新源码、安装锁定依赖并运行检查：

```bash
git pull --ff-only
pnpm install --frozen-lockfile
pnpm run check
pnpm run build
```

如果使用 npm 起始包，请先将新版本解压到临时目录，再有意识地迁移 `sorapaper.ts`、`src/content/` 和 `public/`。在阅读更新说明和差异前，不要直接覆盖已经定制的网站。

## 提交 Bug 与功能建议

请使用 GitHub 表单，以便提供可处理的信息：

- [提交 Bug](https://github.com/AllsVoid/sorapaper/issues/new/choose)：请提供版本、运行环境、复现步骤、预期结果与相关日志。
- [提出功能建议](https://github.com/AllsVoid/sorapaper/issues/new/choose)：请说明问题、预期方案和已考虑的替代方案。

提交前请先搜索已有 Issue，且不要包含密码、令牌或其他敏感信息。

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `pnpm dev` | 启动本地预览 |
| `pnpm run check` | 执行 Astro 类型与内容检查 |
| `pnpm run test` | 执行 Markdown 工具测试 |
| `pnpm run build` | 将生产站点构建至 `dist/` |
| `pnpm run release:check` | 执行完整 npm 发行检查 |

## 更多文档

- [开发指南](docs/development-guide.md)：配置、内容模型与扩展点。
- [设计交接说明](docs/design-handoff.md)：视觉与无障碍规则。
- [更新日志](CHANGELOG.md)：发行与升级说明。
- [旧版 README](docs/legacy-readme.md)：精简 GitHub 首页前保留的完整配置与扩展参考。

## 许可证

[MIT](LICENSE)
