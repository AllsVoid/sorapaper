import { getPostHref, getPostSummary, getPublishedPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getPublishedPosts();

  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        title: post.data.title,
        description: getPostSummary(post),
        excerpt: post.data.excerpt,
        tags: post.data.tags,
        href: getPostHref(post),
        lang: post.data.lang
      }))
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    }
  );
}
