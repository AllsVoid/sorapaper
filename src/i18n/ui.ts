import type { Locale } from "@/i18n/config";
import userConfig from "../../sorapaper";
import { mergeConfig } from "@/config/merge";
import type { UiConfig } from "@/config/types";

export const defaultUi = {
  zh: {
    nav: {
      home: "首页",
      archive: "归档",
      tags: "标签",
      series: "系列",
      about: "关于",
      friends: "友链"
    },
    hero: {
      eyebrow: "欢迎来到我的空间",
      title: "你好，我写前端、设计与生活",
      description: "一个记录想法、实验和日常的小花园。持续构建，持续学习，也持续写作。",
      chips: ["Astro", "前端", "笔记"]
    },
    home: {
      latestPosts: "最新文章",
      viewAll: "查看全部"
    },
    sidebar: {
      tags: "标签",
      browseAllTags: "浏览所有标签",
      now: "Now",
      listening: "正在听",
      reading: "正在读",
      working: "正在做"
    },
    article: {
      back: "返回",
      updated: "更新于",
      share: "分享",
      shareDescription: "复制链接、下载分享图，或分享到常用平台。",
      copyLink: "复制链接",
      copied: "已复制",
      nativeShare: "系统分享",
      downloadSvg: "下载 SVG",
      downloadPng: "下载 PNG",
      shareToX: "分享到 X",
      shareToWeibo: "分享到微博",
      shareToTelegram: "分享到 Telegram",
      wechat: "微信",
      wechatHint: "微信扫码打开文章后，可继续转发给朋友或朋友圈。",
      translationUnavailable: "当前文章暂无对应译文，语言切换会保留在当前页面。",
      postNavigation: "相邻文章",
      previousPost: "上一篇",
      nextPost: "下一篇",
      seriesLabel: "文章系列",
      seriesProgress: "第 {current} 篇，共 {total} 篇",
      licenseLabel: "许可协议",
      licenseDescription: "本文采用 {license} 进行许可。",
      licenses: {
        "cc-by-4.0": "知识共享署名 4.0 国际许可协议",
        "cc-by-nc-4.0": "知识共享署名—非商业性使用 4.0 国际许可协议"
      },
      copyright: "使用 SoraPaper 写作。转载时请保留原文链接。",
      browseArchive: "浏览归档"
    },
    pages: {
      archiveTitle: "按年份归档所有文章",
      archiveDescription: "花园中已发布的文章。",
      tagsTitle: "按主题寻找笔记",
      tagsDescription: "柔和的内容索引。",
      taggedDescription: "这个标签下收录的文章。",
      seriesTitle: "按系列连续阅读",
      seriesDescription: "有顺序地浏览相互关联的文章。",
      seriesPosts: "篇文章",
      seriesEmpty: "这个语言下还没有系列文章。",
      aboutTitle: "关于",
      friendsTitle: "网络花园里的邻居",
      friendsDescription: "一些值得访问的链接。"
    },
    search: {
      label: "搜索文章",
      placeholder: "Astro、设计、生活...",
      empty: "输入关键词搜索标题、摘要和正文。",
      noResults: "暂时没有匹配的文章。",
      ariaOpen: "搜索"
    },
    footer: {
      builtWith: "使用 Astro 构建。",
      runningSince: "本站已经运行了 {time}",
      runtimeDays: "{count} 天",
      runtimeHours: "{count} 小时",
      runtimeMinutes: "{count} 分钟",
      runtimeSeconds: "{count} 秒"
    },
    mermaid: {
      dialog: "Mermaid 图表预览",
      open: "点击放大图表",
      close: "关闭图表预览"
    },
    readingTime: "{minutes} 分钟阅读"
  },
  en: {
    nav: {
      home: "Home",
      archive: "Archive",
      tags: "Tags",
      series: "Series",
      about: "About",
      friends: "Friends"
    },
    hero: {
      eyebrow: "Welcome to my space",
      title: "Hi, I write about frontend, design and life",
      description: "A digital garden of thoughts, experiments and little by little. Building in public, learning out loud.",
      chips: ["Astro", "Frontend", "Notes"]
    },
    home: {
      latestPosts: "Latest Posts",
      viewAll: "View all"
    },
    sidebar: {
      tags: "Tags",
      browseAllTags: "Browse all tags",
      now: "Now",
      listening: "Listening",
      reading: "Reading",
      working: "Working on"
    },
    article: {
      back: "Back",
      updated: "Updated",
      share: "Share",
      shareDescription: "Copy the link, download the social image, or share to common platforms.",
      copyLink: "Copy link",
      copied: "Copied",
      nativeShare: "System share",
      downloadSvg: "Download SVG",
      downloadPng: "Download PNG",
      shareToX: "Share to X",
      shareToWeibo: "Share to Weibo",
      shareToTelegram: "Share to Telegram",
      wechat: "WeChat",
      wechatHint: "Scan with WeChat to open this post, then forward it to chats or Moments.",
      translationUnavailable: "This post is not available in the other language yet. Switching language will keep you here.",
      postNavigation: "Adjacent posts",
      previousPost: "Previous",
      nextPost: "Next",
      seriesLabel: "Article series",
      seriesProgress: "Part {current} of {total}",
      licenseLabel: "License",
      licenseDescription: "This work is licensed under the {license}.",
      licenses: {
        "cc-by-4.0": "Creative Commons Attribution 4.0 International License",
        "cc-by-nc-4.0": "Creative Commons Attribution-NonCommercial 4.0 International License"
      },
      copyright: "Written with SoraPaper. Please keep the original link when reposting.",
      browseArchive: "Browse archive"
    },
    pages: {
      archiveTitle: "All writing, grouped by year",
      archiveDescription: "Published posts in the garden.",
      tagsTitle: "Find notes by topic",
      tagsDescription: "A soft index for the garden.",
      taggedDescription: "Posts collected under this tag.",
      seriesTitle: "Read in series",
      seriesDescription: "Browse connected posts in their intended order.",
      seriesPosts: "posts",
      seriesEmpty: "There are no series posts in this language yet.",
      aboutTitle: "About",
      friendsTitle: "Neighbors in the web garden",
      friendsDescription: "A small collection of links worth visiting."
    },
    search: {
      label: "Search posts",
      placeholder: "Astro, design, life...",
      empty: "Type to search titles, descriptions and post content.",
      noResults: "No matching posts yet.",
      ariaOpen: "Search"
    },
    footer: {
      builtWith: "Built with Astro.",
      runningSince: "Running for {time}",
      runtimeDays: "{count}d",
      runtimeHours: "{count}h",
      runtimeMinutes: "{count}m",
      runtimeSeconds: "{count}s"
    },
    mermaid: {
      dialog: "Mermaid diagram preview",
      open: "Open diagram in full size",
      close: "Close diagram preview"
    },
    readingTime: "{minutes} min read"
  }
} satisfies UiConfig;

export const ui = mergeConfig(defaultUi, userConfig.ui);

export function getUi(locale: Locale) {
  return ui[locale];
}
