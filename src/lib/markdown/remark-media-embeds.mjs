const mediaKinds = new Set(["music", "video"]);
const spotifyTypes = new Set(["album", "artist", "episode", "playlist", "show", "track"]);
const metingTypes = new Set(["album", "artist", "playlist", "song"]);

const providerLabels = {
  bilibili: "Bilibili",
  local: "本地音乐",
  netease: "网易云音乐",
  qq: "QQ 音乐",
  spotify: "Spotify",
  youtube: "YouTube"
};

function normalizeInput(value) {
  return value.trim().replace(/^<|>$/g, "");
}

function parseUrl(value) {
  const candidate = /^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(candidate);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    url.protocol = "https:";
    return url;
  } catch {
    return undefined;
  }
}

function getHashParams(url) {
  const queryIndex = url.hash.indexOf("?");
  return queryIndex === -1 ? new URLSearchParams() : new URLSearchParams(url.hash.slice(queryIndex + 1));
}

function createResult(kind, provider, href, src, options = {}) {
  return {
    kind,
    provider,
    label: providerLabels[provider],
    href,
    src,
    title: providerLabels[provider],
    ...options
  };
}

function parseNetease(value, url) {
  let id;
  let type = "song";

  const prefixed = value.match(/^netease:(?:(album|artist|playlist|song):)?(\d+)$/i);
  if (prefixed) {
    type = prefixed[1]?.toLowerCase() ?? type;
    id = prefixed[2];
  }

  if (!id && url && /(^|\.)music\.163\.com$/i.test(url.hostname)) {
    const routeMatch = `${url.pathname}${url.hash}`.match(/\/(song|album|artist|playlist)(?:\/|\?[^#]*?id=)(\d+)/i);
    id = url.searchParams.get("id") ?? getHashParams(url).get("id") ?? routeMatch?.[2];
    if (routeMatch) {
      type = routeMatch[1].toLowerCase();
      id ??= routeMatch[2];
    }
  }

  if (!id || !/^\d+$/.test(id)) return undefined;

  return createResult(
    "music",
    "netease",
    `https://music.163.com/${type}?id=${id}`,
    undefined,
    { meting: { server: "netease", type, id } }
  );
}

function parseQqMusic(value, url) {
  let id;
  let type = "song";

  const prefixed = value.match(/^qq:(?:(album|artist|playlist|song):)?([a-z\d]{6,32})$/i);
  if (prefixed) {
    type = prefixed[1]?.toLowerCase() ?? type;
    id = prefixed[2];
  }

  if (!id && url && /(^|\.)(?:y|i)\.qq\.com$/i.test(url.hostname)) {
    const pathMatch = url.pathname.match(/\/(songDetail|song|albumDetail|album|singer|playlist)\/([a-z\d]+)/i);
    id = url.searchParams.get("songmid") ?? url.searchParams.get("songid") ?? pathMatch?.[2];
    if (pathMatch) {
      type = pathMatch[1].toLowerCase().includes("album")
        ? "album"
        : pathMatch[1].toLowerCase() === "singer"
          ? "artist"
          : pathMatch[1].toLowerCase() === "playlist"
            ? "playlist"
            : "song";
      id ??= pathMatch[2];
    }
  }

  if (!id || !/^[a-z\d]{6,32}$/i.test(id)) return undefined;
  return createResult(
    "music",
    "qq",
    `https://y.qq.com/n/ryqq/${type === "song" ? "songDetail" : type === "artist" ? "singer" : type}/${id}`,
    undefined,
    { meting: { server: "tencent", type, id } }
  );
}

function parseSpotify(value, url) {
  let type;
  let id;

  const uriMatch = value.match(/^spotify:(album|artist|episode|playlist|show|track):([a-z\d]{10,32})$/i);
  if (uriMatch) {
    type = uriMatch[1].toLowerCase();
    id = uriMatch[2];
  }

  if (!id && url && url.hostname.toLowerCase() === "open.spotify.com") {
    const parts = url.pathname.split("/").filter(Boolean);
    const embedIndex = parts[0] === "embed" ? 1 : 0;
    const localeOffset = parts[embedIndex]?.startsWith("intl-") ? 1 : 0;
    type = parts[embedIndex + localeOffset]?.toLowerCase();
    id = parts[embedIndex + localeOffset + 1];
  }

  if (!type || !spotifyTypes.has(type) || !id || !/^[a-z\d]{10,32}$/i.test(id)) return undefined;

  return createResult(
    "music",
    "spotify",
    `https://open.spotify.com/${type}/${id}`,
    `https://open.spotify.com/embed/${type}/${id}`,
    { height: 152 }
  );
}

function parseBilibili(value, url) {
  let parameter;
  let id;

  const prefixed = value.match(/^bilibili:(BV[a-z\d]{10}|av\d+|ep\d+)$/i);
  const plainId = value.match(/^(BV[a-z\d]{10}|av\d+|ep\d+)$/i);
  const candidate = prefixed?.[1] ?? plainId?.[1];

  if (candidate) {
    const normalized = candidate.toLowerCase();
    parameter = normalized.startsWith("av") ? "aid" : normalized.startsWith("ep") ? "episodeId" : "bvid";
    id = parameter === "bvid" ? candidate : candidate.slice(2);
  }

  if (!id && url && /(^|\.)bilibili\.com$/i.test(url.hostname)) {
    const videoMatch = url.pathname.match(/\/video\/(BV[a-z\d]{10}|av\d+)/i);
    const queryBvid = url.searchParams.get("bvid");
    const queryAid = url.searchParams.get("aid");
    const pathEpisode = url.pathname.match(/\/bangumi\/play\/ep(\d+)/i)?.[1];
    const queryEpisode = url.searchParams.get("episodeId") ?? pathEpisode;
    const urlId = videoMatch?.[1];

    if (queryEpisode && /^\d+$/.test(queryEpisode)) {
      parameter = "episodeId";
      id = queryEpisode;
    } else if (queryBvid && /^BV[a-z\d]{10}$/i.test(queryBvid)) {
      parameter = "bvid";
      id = queryBvid;
    } else if (queryAid && /^\d+$/.test(queryAid)) {
      parameter = "aid";
      id = queryAid;
    } else if (urlId) {
      parameter = urlId.toLowerCase().startsWith("av") ? "aid" : "bvid";
      id = parameter === "aid" ? urlId.slice(2) : urlId;
    }
  }

  if (!parameter || !id) return undefined;

  const href = parameter === "bvid"
    ? `https://www.bilibili.com/video/${id}`
    : parameter === "aid"
      ? `https://www.bilibili.com/video/av${id}`
      : `https://www.bilibili.com/bangumi/play/ep${id}`;

  return createResult(
    "video",
    "bilibili",
    href,
    `https://player.bilibili.com/player.html?${parameter}=${id}&autoplay=0&danmaku=0`
  );
}

function parseYoutube(value, url) {
  let id;

  const prefixed = value.match(/^youtube:([a-z\d_-]{11})$/i);
  const plainId = value.match(/^[a-z\d_-]{11}$/i);
  id = prefixed?.[1] ?? plainId?.[0];

  if (!id && url) {
    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    if (hostname === "youtu.be") {
      id = url.pathname.split("/").filter(Boolean)[0];
    } else if (hostname === "youtube.com" || hostname === "youtube-nocookie.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      id = url.searchParams.get("v") ?? (parts[0] && ["embed", "live", "shorts"].includes(parts[0]) ? parts[1] : undefined);
    }
  }

  if (!id || !/^[a-z\d_-]{11}$/i.test(id)) return undefined;

  return createResult(
    "video",
    "youtube",
    `https://www.youtube.com/watch?v=${id}`,
    `https://www.youtube-nocookie.com/embed/${id}?playsinline=1&rel=0`
  );
}

export function parseMediaEmbed(kind, rawValue) {
  if (!mediaKinds.has(kind) || typeof rawValue !== "string") return undefined;

  const value = normalizeInput(rawValue);
  if (!value) return undefined;
  const url = parseUrl(value);

  if (kind === "music") {
    return parseNetease(value, url) ?? parseQqMusic(value, url) ?? parseSpotify(value, url);
  }

  return parseBilibili(value, url) ?? parseYoutube(value, url);
}

function textContent(node) {
  if (node.type === "text" || node.type === "inlineCode") return node.value ?? "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map(textContent).join("").trim();
}

function getDirectiveValue(node) {
  const provider = node.attributes?.provider;
  const reference = node.attributes?.ref;

  if (provider !== undefined || reference !== undefined) {
    if (typeof provider !== "string" || typeof reference !== "string") return undefined;
    const normalizedProvider = provider.trim().toLowerCase();
    const normalizedReference = reference.trim();
    if (!normalizedProvider || !normalizedReference) return undefined;
    const requestedType = typeof node.attributes?.type === "string" ? node.attributes.type.trim().toLowerCase() : "";
    const typePrefix = ["netease", "qq"].includes(normalizedProvider) && metingTypes.has(requestedType)
      ? `${requestedType}:`
      : "";
    return normalizedReference.toLowerCase().startsWith(`${normalizedProvider}:`)
      ? normalizedReference
      : `${normalizedProvider}:${typePrefix}${normalizedReference}`;
  }

  const attributeValue = node.attributes?.src ?? node.attributes?.url ?? node.attributes?.id;
  if (typeof attributeValue === "string" && attributeValue.trim()) return attributeValue.trim();
  return textContent(node);
}

function isSafeMediaUrl(value) {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value.trim(), "https://sorapaper.local/");
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function parseLocalMusic(node) {
  const provider = node.attributes?.provider;
  if (node.name !== "music" || typeof provider !== "string" || provider.trim().toLowerCase() !== "local") return undefined;

  const src = node.attributes.src?.trim();
  const title = (node.attributes.title ?? node.attributes.name)?.trim();
  const artist = node.attributes.artist?.trim() || "";
  const cover = node.attributes.cover?.trim();
  const lyric = node.attributes.lyric?.trim();

  if (!isSafeMediaUrl(src) || !title || (cover && !isSafeMediaUrl(cover))) return undefined;

  return createResult("music", "local", src, undefined, {
    title,
    meting: {
      url: src,
      name: title,
      artist,
      ...(cover ? { cover } : {}),
      ...(lyric ? { lyric } : {})
    }
  });
}

function getSingleLineDirective(node) {
  if (node.type !== "paragraph") return undefined;
  const match = textContent(node).match(/^:::(music|video)\s+(.+?):::\s*$/);
  if (!match) return undefined;
  return { kind: match[1], value: match[2] };
}

export function createMediaEmbedNode(embed, customTitle) {
  const isVideo = embed.kind === "video";
  const iframeTitle = customTitle?.trim() || embed.title;
  const className = ["media-embed", `media-embed-${embed.kind}`, `media-provider-${embed.provider}`];

  if (embed.meting) {
    return {
      type: "paragraph",
      data: {
        hName: "figure",
        hProperties: {
          className: [...className, "media-player"],
          "data-media-provider": embed.provider,
          "data-meting-player": "true"
        }
      },
      children: [
        {
          type: "paragraph",
          data: {
            hName: "meting-js",
            hProperties: {
              ...embed.meting,
              preload: "metadata",
              mutex: "true",
              "list-folded": "true"
            }
          },
          children: []
        },
        {
          type: "paragraph",
          data: {
            hName: "a",
            hProperties: {
              className: ["media-player-fallback"],
              href: embed.href
            }
          },
          children: [{ type: "text", value: `${iframeTitle} ↗` }]
        }
      ]
    };
  }

  return {
    type: "paragraph",
    data: {
      hName: "figure",
      hProperties: {
        className,
        "data-media-provider": embed.provider
      }
    },
    children: [
      {
        type: "paragraph",
        data: {
          hName: "div",
          hProperties: {
            className: ["media-embed-frame"],
            ...(embed.height ? { style: `--media-embed-height: ${embed.height}px;` } : {})
          }
        },
        children: [
          {
            type: "paragraph",
            data: {
              hName: "iframe",
              hProperties: {
                src: embed.src,
                title: iframeTitle,
                loading: "lazy",
                referrerPolicy: "strict-origin-when-cross-origin",
                allow: isVideo
                  ? "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                  : "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
                allowFullScreen: true
              }
            },
            children: []
          }
        ]
      }
    ]
  };
}

function failUnsupported(file, kind, value, node) {
  const message = `Unsupported ${kind} media reference "${value}". Use provider with ref, or a supported platform URL.`;
  if (typeof file?.fail === "function") file.fail(message, node);
  throw new Error(message);
}

export default function remarkMediaEmbeds() {
  return (tree, file) => {
    function transformChildren(parent) {
      if (!Array.isArray(parent.children)) return;

      for (let index = 0; index < parent.children.length; index += 1) {
        const node = parent.children[index];
        const singleLine = getSingleLineDirective(node);
        const isDirective = (node.type === "containerDirective" || node.type === "leafDirective") && mediaKinds.has(node.name);

        if (singleLine || isDirective) {
          const kind = singleLine?.kind ?? node.name;
          const requestedProvider = isDirective && typeof node.attributes?.provider === "string"
            ? node.attributes.provider.trim().toLowerCase()
            : "";
          const requestedType = isDirective && typeof node.attributes?.type === "string"
            ? node.attributes.type.trim().toLowerCase()
            : "";
          if (["netease", "qq"].includes(requestedProvider) && requestedType && !metingTypes.has(requestedType)) {
            failUnsupported(file, kind, `${requestedProvider}:${requestedType}`, node);
          }
          const value = singleLine?.value ?? getDirectiveValue(node);
          const embed = isDirective ? parseLocalMusic(node) ?? parseMediaEmbed(kind, value) : parseMediaEmbed(kind, value);
          if (!embed) failUnsupported(file, kind, value, node);

          const title = isDirective && typeof node.attributes?.title === "string" ? node.attributes.title : undefined;
          parent.children[index] = createMediaEmbedNode(embed, title);
          continue;
        }

        transformChildren(node);
      }
    }

    transformChildren(tree);
  };
}
