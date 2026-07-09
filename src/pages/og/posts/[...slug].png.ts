import type { APIRoute } from "astro";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import { renderPostOgImage } from "@/lib/og-image";
import { getPostSlug, getPublishedPosts, type BlogPost } from "@/lib/posts";

const require = createRequire(import.meta.url);

const notoSansScDir = dirname(require.resolve("@expo-google-fonts/noto-sans-sc/package.json"));
const fontFiles = [
  join(notoSansScDir, "400Regular/NotoSansSC_400Regular.ttf"),
  join(notoSansScDir, "700Bold/NotoSansSC_700Bold.ttf")
];

export async function getStaticPaths() {
  const posts = await getPublishedPosts();

  return posts.map((post) => ({
    params: { slug: getPostSlug(post) },
    props: { post }
  }));
}

export const GET = (({ props }) => {
  const post = props.post as BlogPost;
  const renderer = new Resvg(renderPostOgImage(post), {
    fitTo: {
      mode: "width",
      value: 1200
    },
    font: {
      fontFiles,
      loadSystemFonts: false
    }
  });
  const png = new Uint8Array(renderer.render().asPng());

  return new Response(png, {
    headers: {
      "content-type": "image/png",
      "cache-control": "public, max-age=31536000, immutable"
    }
  });
}) satisfies APIRoute;
