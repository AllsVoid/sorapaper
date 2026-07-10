import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import mdx from "@astrojs/mdx";
import rehypeKatex from "rehype-katex";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import sitemap from "@astrojs/sitemap";
import { createShikiCodeBlockTransformer, rehypeCodeBlockFrames } from "./src/lib/markdown/code-blocks.mjs";
import remarkCallouts from "./src/lib/markdown/remark-callouts.mjs";
import remarkMermaid from "./src/lib/markdown/remark-mermaid.mjs";
import userConfig from "./sorapaper.ts";

const codeBlocks = {
  copyButton: userConfig.codeBlocks?.copyButton ?? true,
  lineNumbers: userConfig.codeBlocks?.lineNumbers ?? true
};

function normalizeBase(base = "/") {
  const normalized = base.trim();
  if (!normalized || normalized === "/") return "/";
  return `/${normalized.replace(/^\/+|\/+$/g, "")}`;
}

const base = normalizeBase(userConfig.site?.base);

export default defineConfig({
  site: userConfig.site?.url ?? "https://example.com",
  base,
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkGfm, remarkDirective, remarkCallouts, remarkMermaid],
      rehypePlugins: [rehypeKatex, [rehypeCodeBlockFrames, codeBlocks]]
    }),
    shikiConfig: {
      theme: "github-light",
      transformers: [createShikiCodeBlockTransformer(codeBlocks)]
    }
  }
});
