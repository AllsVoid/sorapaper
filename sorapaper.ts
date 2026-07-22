import type { SoraPaperUserConfig } from "./src/config/types";

const config = {
  site: {
    name: "SoraPaper",
    description: "A soft, readable Astro theme for long-form writing.",
    url: "https://example.com",
    base: "/",
    ogImage: "/covers/sky.svg",
    defaultLocale: "zh",
  },
  author: {
    name: "Sora",
    title: "Design Lover",
    bio: "Shark shark~",
    avatar: "/avatar.svg",
    location: "Cloud garden",
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "X", href: "https://x.com/" },
      { label: "Email", href: "mailto:hello@example.com" },
      { label: "WeChat", href: "#wechat" }
    ]
  },
  now: {
    listening: "miwa - ヒカリヘ",
    reading: "The Design of Everyday Things",
    working: "A new project"
  },
  featureFlags: {
    travel: true
  },
  codeBlocks: {
    copyButton: true,
    lineNumbers: false
  },
  article: {
    license: "cc-by-4.0"
  },
  footer: {
    startedAt: "2026-07-16T00:00:00+08:00",
    // Fill these after the corresponding registrations are approved.
    icp: {
      number: ""
    },
    publicSecurity: {
      number: "",
      href: "",
      icon: "/assets/beian-gongan.png"
    }
  },
  colorSchemes: ["paper", "sakura", "moon", "ocean"],
  ui: {
    zh: {
      nav: {
        home: "首页",
        archive: "归档",
        tags: "标签",
        series: "系列",
        about: "关于",
        friends: "友链",
        travel: "游记"
      },
      hero: {
        eyebrow: "欢迎来到我的空间",
        title: "设计并享受生活",
        description: "一个记录想法、实验和日常的小花园。",
        chips: ["生活", "技术", "笔记"]
      },
      article: {
        translationUnavailable: "当前文章暂无对应译文，语言切换会保留在当前页面。",
        postNavigation: "相邻文章",
        previousPost: "上一篇",
        nextPost: "下一篇"
      },
      mermaid: {
        dialog: "Mermaid 图表预览",
        open: "点击放大图表",
        close: "关闭图表预览"
      }
    },
    en: {
      nav: {
        home: "Home",
        archive: "Archive",
        tags: "Tags",
        series: "Series",
        about: "About",
        friends: "Friends",
        travel: "Travel"
      },
      hero: {
        eyebrow: "Welcome to my space",
        title: "Design and enjoy my life",
        description: "A digital garden of thoughts, experiments and little by little. ",
        chips: ["Life", "Technology", "Notes"]
      },
      article: {
        translationUnavailable: "This post is not available in the other language yet. Switching language will keep you here.",
        postNavigation: "Adjacent posts",
        previousPost: "Previous",
        nextPost: "Next"
      },
      mermaid: {
        dialog: "Mermaid diagram preview",
        open: "Open diagram in full size",
        close: "Close diagram preview"
      }
    }
  }
} satisfies SoraPaperUserConfig;

export default config;
