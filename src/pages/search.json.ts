import { getPostHref, getPublishedPosts } from "@/lib/posts";

export async function GET() {
  const posts = await getPublishedPosts();

  return new Response(
    JSON.stringify(
      posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        tags: post.data.tags,
        href: getPostHref(post)
      }))
    ),
    {
      headers: {
        "content-type": "application/json; charset=utf-8"
      }
    }
  );
}
