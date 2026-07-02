import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  i18n: {
    locales: ["zh", "en"],
    defaultLocale: "zh",
    routing: {
      prefixDefaultLocale: true
    }
  },
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
