import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const imageMeta = z.object({
  src: z.string(),
  alt: z.string()
});

const postSlug = z.string().trim().min(1).regex(
  /^[\p{L}\p{N}]+(?:[-_][\p{L}\p{N}]+)*(?:\/[\p{L}\p{N}]+(?:[-_][\p{L}\p{N}]+)*)*$/u,
  "Slug segments may contain letters, numbers, hyphens and underscores, separated by single slashes."
);

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    excerpt: z.string().optional(),
    slug: postSlug.optional(),
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
    seriesOrder: z.number().int().positive().optional(),
    toc: z.boolean().default(true),
    pinned: z.boolean().default(false)
  })
});

const friends = defineCollection({
  loader: glob({ base: "./src/content/friends", pattern: "**/*.md" }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    href: z.url(),
    avatar: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
});

const travel = defineCollection({
  loader: glob({ base: "./src/content/travel", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: postSlug.optional(),
    lang: z.enum(["zh", "en"]).default("zh"),
    translationKey: z.string().optional(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    draft: z.boolean().default(false),
    cover: imageMeta.optional(),
    tags: z.array(z.string()).default([]),
    destinations: z.array(z.object({
      name: z.string(),
      country: z.string(),
      adminCode: z.string().optional(),
      province: z.string().optional(),
      summary: z.string().optional()
    })).min(1),
    featured: z.boolean().default(false)
  }).refine((data) => data.endDate >= data.startDate, {
    message: "endDate must be on or after startDate.",
    path: ["endDate"]
  })
});

export const collections = { blog, friends, travel };
