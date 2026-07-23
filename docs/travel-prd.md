# 游记功能 PRD（SoraPaper）

> 状态：提案；范围：静态站点中的旅行档案与叙事阅读，不是旅行规划或定位追踪应用。

## 1. 背景与目标

SoraPaper 已有由 `featureFlags.travel` 控制的 `/travel/` 页面和导航，但当前只展示空态。博客文章能承载长文，却不能结构化表达一趟旅行的时间、地点、路线和多日片段；读者也无法按目的地发现内容。

本功能要让站长用 Markdown/MDX 维护旅行内容，并让读者获得三种入口：按旅程浏览、按地点发现、沿时间线阅读。它应保留 SoraPaper 的静态优先、低 JavaScript 和内容优先原则。

### 成功指标

- 站长可在不改组件代码的前提下新增一趟旅行，并在一次构建后发布。
- 读者从 `/travel/` 到任意旅程详情不超过两次点击；地图、时间线和正文互相可达。
- 首屏不因地图库阻塞；无 JavaScript、弱网、`prefers-reduced-motion` 下仍可阅读核心内容。
- 关闭 `featureFlags.travel` 时，不产生旅行导航、页面或构建错误；现有博客内容和 URL 保持不变。

## 2. 产品定位与边界

| 做 | 不做（首期） |
| --- | --- |
| 已完成/手工整理的旅行记录、路线、地点、日记与相册入口 | 实时 GPS 追踪、后台定位、账户/关注关系、协作编辑 |
| 静态生成的公开阅读页与本地内容校验 | 行程预订、费用/清单、天气、POI 搜索、AI 行程生成 |
| 可选、延迟加载的交互地图 | 依赖第三方地图服务的在线编辑器 |

这个取舍吸收了 Polarsteps 将路线、地点、照片和故事组织为“一趟旅程”的阅读模型，但不引入其追踪与同步能力；其规划流中的“地点 + 到达日期 + 停留天数”则保留为未来可兼容的字段。开源 WorldTrace 也印证了“时间线、步骤、地图、相册、回顾”是旅行记录的有效信息架构，但这些能力在 SoraPaper 应以可构建的内容文件实现，而非本地数据库应用。[Polarsteps Travel Tracker](https://www.polarsteps.com/travel-tracker) [Polarsteps 行程规划说明](https://support.polarsteps.com/hc/en-us/articles/24265886208914-How-do-I-plan-my-trip) [WorldTrace](https://github.com/Katania91/world-trace-travel-journal)

## 3. 用户与核心场景

**站长（创作者）**：旅行结束后，创建一份旅行概览和若干日记条目；手工填入少量地点坐标、路线和照片，发布一份长期可维护、可被搜索的旅行档案。

**读者（探索者）**：在旅行首页按年份、国家/城市或主题筛选；进入详情先了解“去了哪里、多久、怎么走”，再按天阅读故事；也可从地点卡片跳到所有相关旅程。

**读者（深读者）**：把旅行当作一篇长文阅读；不使用地图也能循着日期、地点与正文获取完整信息。

## 4. 信息架构与路由

```text
/travel/                         旅行首页：精选、年份、目的地、旅行卡片
/travel/[slug]/                  旅行详情：概览、地图、统计、时间线、日记入口
/travel/[slug]/[day-slug]/       单日/单站游记正文（可选，利于深链接与 SEO）
/travel/places/[place-slug]/     地点聚合：地点简介 + 相关旅行与日记
```

首期只实现前两条即可交付完整价值。日记在 MVP 中作为详情页内锚点段落；条目足够多或单日正文很长时，再启用第三条路由。`/travel/` 继续复用现有无 locale 前缀的路由策略，中文和英文条目通过 `translationKey` 关联。

## 5. MVP 功能需求

### 5.1 旅行首页

- 顶部使用现有 hero 语言：旅行数量、已到访国家/地区数（仅基于作者明确填入的数据）。
- 旅行卡片：封面、标题、日期范围、目的地摘要、天数、标签、短摘要；点击进入详情。
- 默认按 `startDate` 倒序，支持按年份、国家/地区、主题标签筛选；筛选应使用 URL query，便于分享与回退。
- 无旅行内容时保留并改进现有空态，给出最小 frontmatter 示例。
- 可选“足迹概览”静态 SVG 作为首页背景/导航，不能代替可读卡片列表。

### 5.2 旅行详情

- 头部：封面、标题、日期范围、地点串、旅行方式、同行者（可隐藏）、摘要与标签。
- `旅程地图`：显示顺序编号的停靠点与可选路线；点选时高亮对应时间线项。地图不可用时，显示地点顺序清单与外部地图链接。
- `旅程概览`：天数、地点数、国家/地区数；距离仅在作者显式填写或导入 GPX 后显示，不能由直线距离伪造。
- `时间线`：按日期分组；每项含地点、时间、标题、摘要、1 张代表图、交通方式和“阅读全文”。
- `旅行笔记`：详情正文采用 Markdown/MDX，适合写行前说明、总结和实用信息；每一个日记条目也支持 Markdown/MDX 正文。
- 结尾显示上一篇/下一篇旅行，以及相关地点、标签和可访问的分享链接。

### 5.3 地点与媒体

- 一个地点在同一旅程中可重复出现，但以稳定的 `placeId` 关联；地点卡片展示名称、行政区/国家、坐标、短注释及外部地图链接。
- 坐标精度由作者控制，默认建议 3 位小数（约百米级），住宿、住址等敏感位置仅使用城市级坐标或不填。
- 图片继续复用现有 Markdown 图片/画廊能力；旅行封面需要 `alt`，日记代表图必须有有意义的替代文本。

### 5.4 配置、国际化与可访问性

- `sorapaper.ts` 新增 `travel` 配置段：首页标题/描述、是否显示地图、默认地图提供商、首页卡片数量和公开地点精度；保留 `featureFlags.travel` 作为总开关。
- 所有按钮、筛选、统计单位、空态和地图替代文本进入 `src/i18n/ui.ts`，同步中英两套文案。
- 地图容器必须带可访问名称；时间线是语义化列表；筛选可用键盘；地图装饰不成为唯一信息源。

## 6. 内容模型（推荐）

建立独立 `travel` Content Collection，而非给 `blog` 增加大量可选字段；这样避免普通文章承担地理和行程校验，并允许未来独立索引与路由。

```yaml
# src/content/travel/2026-kyoto/index.mdx
---
title: "京都，雨落在苔藓上"
description: "五天四夜的京都步行记。"
slug: "kyoto-2026"
lang: zh
translationKey: kyoto-2026
status: published # draft | published
startDate: 2026-04-12
endDate: 2026-04-16
cover: { src: "/travel/kyoto/cover.jpg", alt: "雨后的南禅寺石阶" }
destinations:
  - { name: "京都", country: "JP", placeId: "kyoto", coordinates: [135.7681, 35.0116] }
tags: ["日本", "城市漫步"]
transport: ["步行", "电车"]
route: "/travel/kyoto/route.geojson" # 可选；LineString/MultiLineString
featured: true
---

概览、前言和总结正文。
```

```yaml
# src/content/travel/2026-kyoto/days/01-gion.mdx
---
trip: "kyoto-2026"
title: "第一天：祇园的雨"
date: 2026-04-12
order: 1
placeIds: ["gion", "nanzenji"]
cover: { src: "/travel/kyoto/day-01.jpg", alt: "雨伞掠过石板路" }
transport: "步行"
excerpt: "雨把石板路洗得很亮。"
---
```

**校验规则**：`endDate >= startDate`；经度 `[-180, 180]`、纬度 `[-90, 90]`；日记日期落在旅行日期内（允许 `dateFlexible: true` 豁免）；同一语言下 `slug` 唯一；`trip` 必须指向存在的旅程。`draft` 内容不进入首页、地图、RSS、Pagefind 或统计。

## 7. 地图与技术方案

**推荐方案：渐进增强的 MapLibre GL JS + GeoJSON。** Astro 在构建时输出旅行列表、地点和路线；详情页先输出一张有地点序号的静态 SVG 与文本清单。浏览器仅在地图进入视口、用户允许加载地图且 WebGL 可用时，再动态导入 MapLibre，加载同一份 GeoJSON 并绑定时间线。

MapLibre GL JS 是开源的 TypeScript WebGL 地图库，能直接使用 GeoJSON 和矢量瓦片；适合把交互限制在单个岛屿组件中。[MapLibre 文档](https://maplibre.org/maplibre-gl-js/docs) 但地图瓦片不是“免费且无限”的资源：公开部署不得直接把 `tile.openstreetmap.org` 当成生产瓦片服务，应选定合规的托管/自托管 provider，并按照其条款配置归属信息与缓存。[OSM Tile Usage Policy](https://operations.osmfoundation.org/policies/tiles/)

| 层 | 决策 |
| --- | --- |
| 内容 | `src/content/travel/` 的 MD/MDX + 可选 `public/travel/**.geojson` |
| 校验与查询 | `src/content.config.ts`、`src/lib/travel.ts`；不得把地理逻辑散落进页面 |
| 路由 | `src/pages/travel/`；改造现有 catch-all 为空态/首页后，明确静态路径 |
| UI | `TravelCard`、`TravelTimeline`、`TravelMap`、`PlaceCard`；复用现有卡片、图片与 BaseLayout |
| 客户端 | 只让 `TravelMap` 延迟 hydrate；筛选先用静态链接/query，后续再增强 |
| SEO | 每个旅行有 title、description、canonical、OG 图；详情使用 `TouristTrip`/`Trip` JSON-LD（字段成熟度确认后实施） |

不建议在 MVP 使用全站 Leaflet/MapLibre、地图 API 密钥、浏览器端地理编码或自动路由：它们会破坏构建确定性、增加隐私与服务依赖，并超出“个人游记”的核心价值。


### 7.1 中国行政区“上层投影”交互规范

此模式用于旅行首页的足迹探索，不替代旅程详情页的路线地图。中国内容以**地级市**为默认关联单位；首页渲染至少有一篇已发布游记的省份，以及落在这些省份联合边界范围内的过渡省份。例如仅有苏州、广州时，江苏、广东与其间的省份共同构成连续的区域底图；只有有文章的城市会高亮和链接。地图以最终渲染边界加留白计算最小范围。国际目的地不强制依赖中国行政区数据：作者可提供 `coordinates: [lng, lat]`，由地图作为标记并入范围；未提供坐标时必须保留文本目的地列表。

**视觉与交互顺序**：

1. 初始态只显示真实省级边界与省名（如“江苏”“广东”）；不显示“华东”、城市数量或城市列表。
2. 指针悬停/键盘聚焦/触摸点击某省时，当前省提升到 SVG 最上层，省级边界仍留在底层，省名淡出；同一地理位置的市级行政区层以 `translateY(-20~28px) + scale(2.4) + shadow` 从其正上方展开；投影打开时底层省份弱化，指针离开地图区域时收起投影，形成“投影盒子”效果，而不是跟随鼠标的聚光效果。
3. 展开层默认显示该省全部地级市的真实边界、位置和市名；有文章的城市使用高亮色、其余城市为中性底色。示例：苏州高亮于江苏市级层，广州/深圳高亮于广东市级层。
4. 指针移动到高亮城市或点击/键盘激活该城市后，才更新右侧（移动端为地图下方）的文章预览；不因省级悬停直接打开文章。
5. 指针离开“省级底层 + 已展开市级层”的合并热区后，关闭投影层；触摸设备由再次点击省级底层关闭，点击其他省切换。

```text
idle
  └─ hover/focus/tap province ─→ province-expanded
                                  ├─ hover/click visited city ─→ article-preview
                                  ├─ enter another province ───→ province-expanded(new)
                                  └─ leave combined hit area ──→ idle
```

**实现契约（必须遵守）**：

- 构建期下载并校验行政区 GeoJSON/TopoJSON，产出 `provinceFeatures` 与按 `provinceCode` 分组的 `cityFeatures`；运行时不得请求地理编码服务或动态拼接地图数据。
- 底层省级 `<path>` 和上层市级 `<path>` 在首次渲染时同时创建，并共享同一个 `projection`、`geoPath` 和 SVG `viewBox`。上层仅通过 `opacity`、`transform`、`pointer-events` 与 `aria-hidden` 切换，**不得**在 hover 回调中 `innerHTML` 重建 SVG。
- 每个省使用一个包裹 `<g>`：`province-base` 为底层，`city-projection` 为上层；包裹组同时监听 `pointerenter` / `pointerleave`，以避免指针从省 path 移到上层 city path 时被错误判定为离开。
- 地图状态只由一个 `activeProvinceCode` 和可选 `activeCityCode` 驱动；所有 DOM class、文章预览、ARIA 状态均从这两个值派生。切换省份时先清空 `activeCityCode`，再展开新的市级层。
- SVG path 采用 `role="button"`、可聚焦元素及可读的 `aria-label`；同时提供常规地点列表作为无 JS / 屏幕阅读器回退。不得把 `<button>` 嵌套在 `<button>` 中。
- 动画仅影响合成属性（`transform`、`opacity`、`filter`）；尊重 `prefers-reduced-motion`，在该模式下直接切换层级状态。
- 初始范围以已渲染边界和坐标标记的联合包围盒计算，并加入固定比例留白；当跨区域内容使范围明显扩大时，提供可键盘操作的放大、缩小、复位和方向键平移控件，并支持鼠标/触摸拖动，且文本目的地列表始终可用。

推荐的运行时数据形状：

```ts
type AdminFeature = GeoJSON.Feature & {
  properties: {
    code: string;        // 省：320000；市：320500
    name: string;        // 苏州市
    parentCode?: string; // 市级为 320000
  };
};

type CityTravelSummary = {
  cityCode: string;
  postCount: number;
  featuredPost: { title: string; href: string; cover?: { src: string; alt: string } };
};
```

实现时以 `CityTravelSummary.cityCode` 联结 `cityFeatures.properties.code`；只把 `postCount > 0` 的城市标为高亮。真实行政区边界可采用已简化的公开 GeoJSON/TopoJSON；`cn-atlas` 提供中国省级与地级市边界及行政区代码，适合作为构建期数据源。[cn-atlas](https://github.com/BarbarossaWang/cn-atlas)

## 8. 交互与视觉原则

- 地图是叙事的索引，不是仪表盘：在桌面端与时间线并排，在移动端位于时间线前；点击标记滚动至条目，点击条目在地图上聚焦。
- 足迹首页的中国行政区模式遵循“省级底层 → 市级投影层 → 文章预览”的三级关系；只突出作者确实写过的城市，不能把行政区填色误作访问记录。
- 用现有 `--surface`、`--primary`、`--accent`、圆角与柔和阴影；路线只使用一种主色，状态使用编号和文本共同表达，不能只依赖色彩。
- 移动端首屏优先显示标题、日期、地点、摘要与“查看时间线”；地图高度受限并提供“展开地图”。
- 深色、浅色、中文长地名、英文长标题、无封面/无坐标/单日旅行都必须有完整布局。

## 9. 发布阶段与验收

| 阶段 | 交付 | 验收 |
| --- | --- | --- |
| P0 内容基础 | collection、schema、`lib/travel.ts`、两份示例旅行 | 无效坐标/日期/关联会在 `pnpm run check` 报错；关闭开关不生成旅行路径 |
| P1 阅读体验 | 首页、详情、卡片、时间线、双语、SEO | 可从首页进入详情；无 JS 时可完整阅读；中英文及移动/深浅色通过人工检查 |
| P2 地图增强 | GeoJSON、静态回退、行政区投影层、地图-时间线联动 | 首屏不加载地图包；市级层与底层省界共享投影且不在 hover 时重建；WebGL/网络失败仍显示地点清单；地图 provider 归属可见 |
| P3 发现与扩展 | 地点页、筛选、GPX 导入脚本、旅行 OG 卡 | 路径可分享；GPX 仅在构建期转换；不引入运行时密钥 |

每阶段至少执行：`pnpm run check`、`pnpm exec astro build`，以及代表性内容的路由检查。P1/P2 另做桌面与移动、深浅色、中英、键盘与禁用 JS 的视觉验收。

## 10. 风险与待确认决策

1. **瓦片服务与成本**：由站长选择合规 provider，并把 provider URL/attribution 作为配置；不承诺默认公共 OSM 瓦片可用于生产。
2. **地理隐私**：不自动从 EXIF 提取坐标；默认降精度，明确提示不要填住宿和实时位置。
3. **内容复杂度**：首期只支持手写 GeoJSON；GPX 导入放到构建期脚本，避免浏览器端大文件和格式兼容问题。
4. **结构化数据类型**：实现前确认 Google/Schema.org 对 `TouristTrip` 的当前支持范围；无法确认时仅保留 `BlogPosting` 与 `Place` 级别语义。
5. **路由兼容**：现有 `/travel/[...path].astro` 是空态 catch-all。实施前需决定是否由其承接首页并新增显式详情路由，或拆成 `index.astro` 与动态路由；迁移时确保 `/travel/` 不变。

## 11. 暂不纳入路线图的功能

实时足迹、私密分享、多人协作、预算/订票、天气、自动地点识别、AI 行程生成、地图编辑、社交 feed、成就统计与实体旅行书。它们更适合有账户和服务端的数据产品，不应稀释 SoraPaper 的静态内容定位。
