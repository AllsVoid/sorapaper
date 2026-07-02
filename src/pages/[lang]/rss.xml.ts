import rss from "@astrojs/rss";
import { themeConfig } from "@/config/theme";
import { getLocaleFromParams, locales } from "@/i18n/config";
import { getPostHref, getPublishedPosts } from "@/lib/posts";

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

export async function GET({ site, params }: { site: URL; params: Record<string, string | undefined> }) {
  const locale = getLocaleFromParams(params);
  const posts = await getPublishedPosts(locale);

  return rss({
    title: `${themeConfig.name} (${locale})`,
    description: themeConfig.description,
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: getPostHref(post, locale)
    }))
  });
}
