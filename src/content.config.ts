import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const imageMeta = z.object({
  src: z.string(),
  alt: z.string()
});

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    lang: z.enum(["zh", "en"]).default("en"),
    translationKey: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    category: z.string().default("Notes"),
    draft: z.boolean().default(false),
    cover: imageMeta.optional(),
    ogImage: z.string().optional(),
    series: z.string().optional(),
    toc: z.boolean().default(true),
    pinned: z.boolean().default(false)
  })
});

const friends = defineCollection({
  loader: glob({ base: "./src/content/friends", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    href: z.string().url(),
    avatar: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog, friends };
