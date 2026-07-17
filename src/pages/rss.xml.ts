import rss from "@astrojs/rss";
import { themeConfig } from "@/config/theme";
import { getPostHref, getPostSummary, getPublishedPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/paths";

export async function GET() {
  const posts = await getPublishedPosts();

  return rss({
    title: themeConfig.name,
    description: themeConfig.description,
    site: absoluteUrl("/"),
    items: posts.map((post) => ({
      title: post.data.title,
      description: getPostSummary(post),
      pubDate: post.data.pubDate,
      link: getPostHref(post)
    }))
  });
}
