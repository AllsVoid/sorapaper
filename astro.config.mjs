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
import userConfig from "./sorapaper.ts";

const codeBlocks = {
  copyButton: userConfig.codeBlocks?.copyButton ?? true,
  lineNumbers: userConfig.codeBlocks?.lineNumbers ?? true
};

export default defineConfig({
  site: userConfig.site?.url ?? "https://example.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath, remarkGfm, remarkDirective, remarkCallouts],
      rehypePlugins: [rehypeKatex, [rehypeCodeBlockFrames, codeBlocks]]
    }),
    shikiConfig: {
      theme: "github-light",
      transformers: [createShikiCodeBlockTransformer(codeBlocks)]
    }
  }
});
