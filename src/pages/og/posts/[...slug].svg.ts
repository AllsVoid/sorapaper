import type { APIRoute } from "astro";
import { renderPostOgImage } from "@/lib/og-image";
import { getPostSlug, getPublishedPosts, type BlogPost } from "@/lib/posts";

export async function getStaticPaths() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    params: { slug: getPostSlug(post) },
    props: { post }
  }));
}

export const GET = (({ props }) => {
  const post = props.post as BlogPost;

  return new Response(renderPostOgImage(post), {
    headers: {
      "content-type": "image/svg+xml; charset=utf-8",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
}) satisfies APIRoute;
