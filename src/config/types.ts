type Primitive = string | number | boolean | bigint | symbol | null | undefined;

export type DeepPartial<T> = T extends Primitive
  ? T
  : T extends Array<infer U>
    ? Array<DeepPartial<U>>
    : {
        [K in keyof T]?: DeepPartial<T[K]>;
      };

export type LocaleCode = "zh" | "en";

export interface LocaleUiConfig {
  nav: Record<"home" | "archive" | "tags" | "about" | "friends", string>;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    chips: string[];
  };
  home: {
    latestPosts: string;
    viewAll: string;
  };
  sidebar: {
    tags: string;
    browseAllTags: string;
    now: string;
    listening: string;
    reading: string;
    working: string;
  };
  article: {
    back: string;
    updated: string;
    copyright: string;
    browseArchive: string;
  };
  pages: {
    archiveTitle: string;
    archiveDescription: string;
    tagsTitle: string;
    tagsDescription: string;
    taggedDescription: string;
    aboutTitle: string;
    friendsTitle: string;
    friendsDescription: string;
  };
  search: {
    label: string;
    placeholder: string;
    empty: string;
    noResults: string;
    ariaOpen: string;
  };
  footer: {
    builtWith: string;
  };
  readingTime: string;
}

export type UiConfig = Record<LocaleCode, LocaleUiConfig>;

export interface SoraPaperThemeConfig {
  site: {
    name: string;
    description: string;
    url: string;
    defaultLocale: LocaleCode;
    locales: LocaleCode[];
  };
  author: {
    name: string;
    title: string;
    bio: string;
    avatar: string;
    location: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
  now: {
    listening: string;
    reading: string;
    working: string;
  };
  featureFlags: {
    search: boolean;
    comments: boolean;
    analytics: boolean;
    viewTransitions: boolean;
  };
  colorSchemes: string[];
}

export interface SoraPaperConfig extends SoraPaperThemeConfig {
  ui: UiConfig;
}

export type SoraPaperUserConfig = DeepPartial<SoraPaperConfig>;
