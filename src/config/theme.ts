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
  nav: [
    { label: "Home", href: "/" },
    { label: "Archive", href: "/archive/" },
    { label: "Tags", href: "/tags/" },
    { label: "About", href: "/about/" },
    { label: "Friends", href: "/friends/" }
  ],
  hero: {
    eyebrow: "Welcome to my space",
    title: "Hi, I write about frontend, design and life",
    description:
      "A digital garden of thoughts, experiments and little by little. Building in public, learning out loud.",
    chips: ["Astro", "Frontend", "Notes"]
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
