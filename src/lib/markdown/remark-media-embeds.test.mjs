import assert from "node:assert/strict";
import test from "node:test";

import remarkMediaEmbeds, { createMediaEmbedNode, parseMediaEmbed } from "./remark-media-embeds.mjs";

test("parses supported music providers", () => {
  assert.equal(parseMediaEmbed("music", "https://music.163.com/#/song?id=19723756")?.provider, "netease");
  assert.equal(parseMediaEmbed("music", "qq:0039MnYb0qxYhV")?.provider, "qq");
  assert.equal(parseMediaEmbed("music", "spotify:track:11dFghVXANMlKmJXsNCbNl")?.provider, "spotify");
});

test("parses supported video providers", () => {
  assert.equal(parseMediaEmbed("video", "https://www.bilibili.com/video/BV1B7411m7LV")?.provider, "bilibili");
  assert.equal(parseMediaEmbed("video", "https://www.bilibili.com/bangumi/play/ep123456")?.src, "https://player.bilibili.com/player.html?episodeId=123456&autoplay=0&danmaku=0");
  assert.equal(parseMediaEmbed("video", "https://youtu.be/M7lc1UVf-VE")?.provider, "youtube");
});

test("rejects unknown providers and mismatched media types", () => {
  assert.equal(parseMediaEmbed("music", "https://example.com/song/1"), undefined);
  assert.equal(parseMediaEmbed("music", "https://youtu.be/M7lc1UVf-VE"), undefined);
  assert.equal(parseMediaEmbed("video", "https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl"), undefined);
});

test("creates a lazy, allowlisted iframe node", () => {
  const embed = parseMediaEmbed("video", "youtube:M7lc1UVf-VE");
  const node = createMediaEmbedNode(embed);
  const iframe = node.children[0].children[0];

  assert.equal(iframe.data.hProperties.loading, "lazy");
  assert.equal(iframe.data.hProperties.src, "https://www.youtube-nocookie.com/embed/M7lc1UVf-VE?playsinline=1&rel=0");
  assert.equal(iframe.data.hProperties.allowFullScreen, true);
  assert.equal(node.children.length, 1);
});

test("transforms the requested single-line syntax", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [{ type: "text", value: ":::music https://music.163.com/song?id=19723756:::" }]
      }
    ]
  };

  remarkMediaEmbeds()(tree, { fail(message) { throw new Error(message); } });

  assert.equal(tree.children[0].data.hName, "figure");
  assert.deepEqual(tree.children[0].data.hProperties.className, ["media-embed", "media-embed-music", "media-provider-netease"]);
});

test("transforms single-line URLs after Markdown autolinking", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "paragraph",
        children: [
          { type: "text", value: ":::video " },
          { type: "link", url: "https://www.bilibili.com/video/BV1B7411m7LV", children: [{ type: "text", value: "https://www.bilibili.com/video/BV1B7411m7LV" }] },
          { type: "text", value: ":::" }
        ]
      }
    ]
  };

  remarkMediaEmbeds()(tree, { fail(message) { throw new Error(message); } });

  assert.equal(tree.children[0].data.hProperties["data-media-provider"], "bilibili");
});

test("transforms leaf directives with provider and ref", () => {
  const tree = {
    type: "root",
    children: [
      { type: "leafDirective", name: "music", attributes: { provider: "netease", ref: "19723756" }, children: [] },
      { type: "leafDirective", name: "music", attributes: { provider: "spotify", ref: "track:11dFghVXANMlKmJXsNCbNl" }, children: [] },
      { type: "leafDirective", name: "video", attributes: { provider: "bilibili", ref: "ep123456" }, children: [] }
    ]
  };

  remarkMediaEmbeds()(tree, { fail(message) { throw new Error(message); } });

  assert.equal(tree.children[0].data.hProperties["data-media-provider"], "netease");
  assert.equal(tree.children[1].data.hProperties["data-media-provider"], "spotify");
  assert.equal(tree.children[2].children[0].children[0].data.hProperties.src, "https://player.bilibili.com/player.html?episodeId=123456&autoplay=0&danmaku=0");
});

test("rejects incomplete provider and ref pairs", () => {
  const tree = {
    type: "root",
    children: [
      { type: "leafDirective", name: "music", attributes: { provider: "netease" }, children: [] }
    ]
  };

  assert.throws(
    () => remarkMediaEmbeds()(tree, { fail(message) { throw new Error(message); } }),
    /Unsupported music media reference/
  );
});

test("transforms container directives with src attributes", () => {
  const tree = {
    type: "root",
    children: [
      {
        type: "containerDirective",
        name: "video",
        attributes: { src: "https://www.bilibili.com/video/BV1B7411m7LV", title: "演示视频" },
        children: []
      }
    ]
  };

  remarkMediaEmbeds()(tree, { fail(message) { throw new Error(message); } });

  const iframe = tree.children[0].children[0].children[0];
  assert.equal(iframe.data.hProperties.title, "演示视频");
});
