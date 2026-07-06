import type { SoraPaperUserConfig } from "./src/config/types";

const config = {
  site: {
    name: "SoraPaper",
    description: "A soft, readable Astro theme for long-form writing.",
    url: "https://example.com",
    ogImage: "/covers/sky.svg",
    defaultLocale: "zh",
    locales: ["zh", "en"]
  },
  author: {
    name: "Sora",
    title: "Frontend Developer & Design Lover",
    bio: "I enjoy building things for the web, beautiful interfaces and writing about the process.",
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
    search: true,
    comments: false,
    analytics: false,
    viewTransitions: true
  },
  colorSchemes: ["paper", "sakura", "moon", "ocean"],
  ui: {
    zh: {
      nav: {
        home: "首页",
        archive: "归档",
        tags: "标签",
        about: "关于",
        friends: "友链"
      },
      hero: {
        eyebrow: "欢迎来到我的空间",
        title: "你好，我写前端、设计与生活",
        description: "一个记录想法、实验和日常的小花园。持续构建，持续学习，也持续写作。",
        chips: ["Astro", "前端", "笔记"]
      }
    },
    en: {
      nav: {
        home: "Home",
        archive: "Archive",
        tags: "Tags",
        about: "About",
        friends: "Friends"
      },
      hero: {
        eyebrow: "Welcome to my space",
        title: "Hi, I write about frontend, design and life",
        description: "A digital garden of thoughts, experiments and little by little. Building in public, learning out loud.",
        chips: ["Astro", "Frontend", "Notes"]
      }
    }
  }
} satisfies SoraPaperUserConfig;

export default config;
