import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedPosts(locale?: Locale) {
  const posts = await getCollection("blog", ({ data }) => !data.draft && (!locale || data.lang === locale));
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getPinnedPosts(locale?: Locale) {
  return (await getPublishedPosts(locale)).filter((post) => post.data.pinned);
}

export function getPostSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/i, "");
}

export function getPostHref(post: BlogPost) {
  return `/posts/${getPostSlug(post)}/`;
}

export function getPostAlternates(post: BlogPost, posts: BlogPost[]) {
  const alternates = new Map<Locale, string>();
  const relatedPosts = post.data.translationKey
    ? posts.filter((item) => item.data.translationKey === post.data.translationKey)
    : [post];

  for (const relatedPost of relatedPosts) {
    alternates.set(relatedPost.data.lang, getPostHref(relatedPost));
  }

  return Object.fromEntries(alternates) as Partial<Record<Locale, string>>;
}

export function getTranslatedPost(post: BlogPost, posts: BlogPost[], targetLocale: Locale) {
  if (!post.data.translationKey) return undefined;

  return posts.find((item) => item.data.lang === targetLocale && item.data.translationKey === post.data.translationKey);
}

export function getAdjacentPosts(posts: BlogPost[], currentPost: BlogPost) {
  const currentIndex = posts.findIndex((post) => post.id === currentPost.id);

  return {
    previousPost: currentIndex > 0 ? posts[currentIndex - 1] : undefined,
    nextPost: currentIndex >= 0 ? posts[currentIndex + 1] : undefined
  };
}

export function getReadingTime(body = "", locale: Locale = defaultLocale) {
  const wordsPerMinute = 320;
  const chineseChars = body.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  const latinWords = body.replace(/[\u4e00-\u9fa5]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil((chineseChars + latinWords) / wordsPerMinute));
  return getUi(locale).readingTime.replace("{minutes}", String(minutes));
}

export function formatDate(date: Date, locale: Locale = defaultLocale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function getAllTags(posts: BlogPost[]) {
  const tags = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      const normalized = tag.trim();
      tags.set(normalized, (tags.get(normalized) ?? 0) + 1);
    }
  }
  return [...tags.entries()]
    .map(([name, count]) => ({ name, count, slug: name.toLowerCase() }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getArchiveGroups(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const year = String(post.data.pubDate.getFullYear());
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()].sort(([a], [b]) => Number(b) - Number(a));
}
