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
  nav: Record<"home" | "archive" | "tags" | "series" | "about" | "friends" | "travel", string>;
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
    share: string;
    shareDescription: string;
    copyLink: string;
    copied: string;
    nativeShare: string;
    downloadSvg: string;
    downloadPng: string;
    shareToX: string;
    shareToWeibo: string;
    shareToTelegram: string;
    wechat: string;
    wechatHint: string;
    translationUnavailable: string;
    postNavigation: string;
    previousPost: string;
    nextPost: string;
    seriesLabel: string;
    seriesProgress: string;
    copyright: string;
    browseArchive: string;
  };
  pages: {
    archiveTitle: string;
    archiveDescription: string;
    tagsTitle: string;
    tagsDescription: string;
    taggedDescription: string;
    seriesTitle: string;
    seriesDescription: string;
    seriesPosts: string;
    seriesEmpty: string;
    aboutTitle: string;
    friendsTitle: string;
    friendsDescription: string;
    travelTitle: string;
    travelDescription: string;
    travelEmptyTitle: string;
    travelEmptyDescription: string;
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
    base: string;
    ogImage: string;
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
      icon?: string;
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
  codeBlocks: {
    copyButton: boolean;
    lineNumbers: boolean;
  };
  colorSchemes: string[];
}

export interface SoraPaperConfig extends SoraPaperThemeConfig {
  ui: UiConfig;
}

export type SoraPaperUserConfig = DeepPartial<SoraPaperConfig>;
