import rss from "@astrojs/rss";
import { themeConfig } from "@/config/theme";
import { getPostHref, getPublishedPosts } from "@/lib/posts";

export async function GET(context: { site: URL }) {
  const posts = await getPublishedPosts();

  return rss({
    title: themeConfig.name,
    description: themeConfig.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostHref(post)
    }))
  });
}
