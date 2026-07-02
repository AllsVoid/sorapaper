export const themeConfig = {
  name: "SoraPaper",
  description: "A soft, readable Astro theme for long-form writing.",
  author: {
    name: "Sora",
    title: "Frontend Developer & Design Lover",
    bio: "I enjoy building things for the web, beautiful interfaces and writing about the process.",
    avatar: "/avatar.svg",
    location: "Cloud garden",
    links: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "Twitter", href: "https://twitter.com/" },
      { label: "Email", href: "mailto:hello@example.com" }
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
  colorSchemes: ["paper", "sakura", "moon", "ocean"] as const
};

export type ThemeConfig = typeof themeConfig;
