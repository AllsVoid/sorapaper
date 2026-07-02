import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import userConfig from "./sorapaper.ts";

export default defineConfig({
  site: userConfig.site?.url ?? "https://example.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
