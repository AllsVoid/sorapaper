import { getLocaleFromParams, locales } from "@/i18n/config";
import { getPostHref, getPublishedPosts } from "@/lib/posts";

export function getStaticPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

export async function GET({ params }: { params: Record<string, string | undefined> }) {
  const locale = getLocaleFromParams(params);
  const posts = await getPublishedPosts(locale);

  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        tags: post.data.tags,
        href: getPostHref(post, locale)
      }))
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    }
  );
}
