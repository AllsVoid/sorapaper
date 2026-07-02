import { getCollection, type CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

export async function getPublishedPosts() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export async function getPinnedPosts() {
  return (await getPublishedPosts()).filter((post) => post.data.pinned);
}

export function getPostSlug(post: BlogPost) {
  return post.id.replace(/\.(md|mdx)$/i, "");
}

export function getPostHref(post: BlogPost) {
  return `/posts/${getPostSlug(post)}/`;
}

export function getReadingTime(body = "") {
  const wordsPerMinute = 320;
  const chineseChars = body.match(/[\u4e00-\u9fa5]/g)?.length ?? 0;
  const latinWords = body.replace(/[\u4e00-\u9fa5]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil((chineseChars + latinWords) / wordsPerMinute));
  return `${minutes} min read`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
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
    .map(([name, count]) => ({ name, count, slug: encodeURIComponent(name.toLowerCase()) }))
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
