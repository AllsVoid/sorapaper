import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkDirective from "remark-directive";
import sitemap from "@astrojs/sitemap";
import remarkCallouts from "./src/lib/markdown/remark-callouts.mjs";
import userConfig from "./sorapaper.ts";

export default defineConfig({
  site: userConfig.site?.url ?? "https://example.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkCallouts],
    shikiConfig: {
      theme: "github-light"
    }
  }
});
