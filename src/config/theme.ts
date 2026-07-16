import userConfig from "../../sorapaper";
import { mergeConfig } from "@/config/merge";
import type { SoraPaperThemeConfig } from "@/config/types";

export const defaultThemeConfig = {
  site: {
    name: "SoraPaper",
    description: "A soft, readable Astro theme for long-form writing.",
    url: "https://example.com",
    base: "/",
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
    comments: false,
    analytics: false,
    travel: false,
    viewTransitions: true
  },
  codeBlocks: {
    copyButton: true,
    lineNumbers: true
  },
  article: {
    license: "cc-by-4.0"
  },
  footer: {},
  colorSchemes: ["paper", "sakura", "moon", "ocean"]
} satisfies SoraPaperThemeConfig;

const mergedThemeConfig = mergeConfig(defaultThemeConfig, userConfig);

export const themeConfig: SoraPaperThemeConfig & { name: string; description: string } = {
  ...mergedThemeConfig,
  name: mergedThemeConfig.site.name,
  description: mergedThemeConfig.site.description
};

export type ThemeConfig = typeof themeConfig;
