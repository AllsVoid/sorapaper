import { getCollection, type CollectionEntry } from "astro:content";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import { getUi } from "@/i18n/ui";
import { withBase } from "@/lib/paths";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedPosts(locale?: Locale) {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  assertUniquePostSlugs(posts);

  return posts
    .filter((post) => !locale || post.data.lang === locale)
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getPinnedPosts(locale?: Locale) {
  return (await getPublishedPosts(locale)).filter((post) => post.data.pinned);
}

export function getPostSlug(post: BlogPost) {
  return post.data.slug ?? post.id.replace(/\.(md|mdx)$/i, "");
}

function assertUniquePostSlugs(posts: BlogPost[]) {
  const postBySlug = new Map<string, BlogPost>();

  for (const post of posts) {
    const slug = getPostSlug(post);
    const existingPost = postBySlug.get(slug);
    if (existingPost) {
      throw new Error(
        `Duplicate published post slug "${slug}" in "${existingPost.id}" and "${post.id}".`
      );
    }
    postBySlug.set(slug, post);
  }
}

export function getPostHref(post: BlogPost) {
  return withBase(`/posts/${getPostSlug(post)}/`);
}

export function getPostSummary(post: BlogPost) {
  return post.data.excerpt ?? post.data.description;
}

export function getPostOgImageHref(post: BlogPost) {
  return withBase(`/og/posts/${getPostSlug(post)}.svg`);
}

export function getPostOgImagePngHref(post: BlogPost) {
  return withBase(`/og/posts/${getPostSlug(post)}.png`);
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
    .map(([name, count]) => ({ name, count, slug: getTagSlug(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function getTagSlug(tag: string) {
  const normalized = tag.normalize("NFKC").trim().toLowerCase();
  const slug = normalized
    .replace(/[\s\\/?#%]+/g, "-")
    .replace(/[^\p{L}\p{N}_-]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || [...normalized].map((character) => character.codePointAt(0)?.toString(16)).join("-");
}

export function getArchiveGroups(posts: BlogPost[]) {
  const groups = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const year = String(post.data.pubDate.getFullYear());
    groups.set(year, [...(groups.get(year) ?? []), post]);
  }
  return [...groups.entries()].sort(([a], [b]) => Number(b) - Number(a));
}

export function getSeriesSlug(series: string) {
  return series.trim().toLowerCase().replace(/\s+/g, "-").replace(/[\\/?#]+/g, "-").replace(/-+/g, "-");
}

export function getSeriesPosts(posts: BlogPost[], series: string) {
  return posts
    .filter((post) => post.data.series?.trim().toLowerCase() === series.trim().toLowerCase())
    .sort((a, b) => {
      const aOrder = a.data.seriesOrder;
      const bOrder = b.data.seriesOrder;
      if (aOrder !== undefined || bOrder !== undefined) {
        if (aOrder === undefined) return 1;
        if (bOrder === undefined) return -1;
        if (aOrder !== bOrder) return aOrder - bOrder;
      }
      return a.data.pubDate.getTime() - b.data.pubDate.getTime();
    });
}

export function getAllSeries(posts: BlogPost[]) {
  const seriesMap = new Map<string, { name: string; posts: BlogPost[] }>();

  for (const post of posts) {
    const name = post.data.series?.trim();
    if (!name) continue;
    const slug = getSeriesSlug(name);
    const entry = seriesMap.get(slug) ?? { name, posts: [] };
    entry.posts.push(post);
    seriesMap.set(slug, entry);
  }

  return [...seriesMap.entries()]
    .map(([slug, entry]) => ({ slug, name: entry.name, posts: getSeriesPosts(entry.posts, entry.name) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
