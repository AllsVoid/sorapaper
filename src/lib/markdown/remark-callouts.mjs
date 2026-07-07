const calloutLabels = {
  note: "Note",
  info: "Info",
  tips: "Tips",
  tip: "Tips",
  warning: "Warning",
  success: "Success",
  error: "Error"
};

const calloutTypes = new Set(Object.keys(calloutLabels));
const loadingValues = new Set(["lazy", "eager"]);
const decodingValues = new Set(["async", "sync", "auto"]);
const booleanAttributeValues = new Map([
  ["true", "true"],
  ["false", "false"]
]);

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, callback);
  }
}

function getDirectiveLabel(node, fallback) {
  const firstChild = node.children?.[0];

  if (
    firstChild?.type === "paragraph" &&
    firstChild.data?.directiveLabel &&
    firstChild.children?.length > 0
  ) {
    const title = firstChild.children
      .filter((child) => child.type === "text")
      .map((child) => child.value)
      .join("")
      .trim();

    node.children.shift();

    if (title) return title;
  }

  return fallback;
}

function isOpenDetails(node) {
  const open = node.attributes?.open;
  return open === "" || open === true || open === "true";
}

function getStringAttribute(node, key) {
  const value = node.attributes?.[key];
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed || undefined;
}

function getImageScale(node) {
  const rawScale = getStringAttribute(node, "scale");
  const scale = Number(rawScale ?? 100);

  if (!Number.isFinite(scale)) return 100;
  return Math.min(100, Math.max(1, scale));
}

function getImageRatio(node) {
  const rawRatio = getStringAttribute(node, "ratio");
  if (!rawRatio) return "16 / 9";

  const ratio = rawRatio.replace(/\s+/g, "");
  if (/^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/.test(ratio)) {
    return ratio.replace("/", " / ");
  }

  return "16 / 9";
}

function getAllowedValue(node, key, allowedValues, fallback) {
  const value = getStringAttribute(node, key);
  return value && allowedValues.has(value) ? value : fallback;
}

function getBooleanAttribute(node, key) {
  const value = node.attributes?.[key];
  if (value === "" || value === true) return "true";
  if (value === false) return "false";
  if (typeof value !== "string") return undefined;

  return booleanAttributeValues.get(value.trim().toLowerCase());
}

function transformImage(node) {
  const src = getStringAttribute(node, "src");
  if (!src) return;

  const alt = getStringAttribute(node, "alt") ?? "";
  const caption = getStringAttribute(node, "caption");
  const credit = getStringAttribute(node, "credit");
  const href = getStringAttribute(node, "href");
  const live = getStringAttribute(node, "live");
  const liveControls = getBooleanAttribute(node, "liveControls");
  const livePreload = getBooleanAttribute(node, "livePreload");
  const photoTime = getStringAttribute(node, "photoTime");
  const title = getStringAttribute(node, "title");
  const scale = getImageScale(node);
  const ratio = getImageRatio(node);
  const loading = getAllowedValue(node, "loading", loadingValues, "lazy");
  const decoding = getAllowedValue(node, "decoding", decodingValues, "async");
  const imageNode = {
    type: "image",
    url: src,
    alt,
    title,
    data: {
      hProperties: {
        className: ["image-block-media"],
        loading,
        decoding
      }
    }
  };
  const livePlayerNode = live
    ? {
        type: "paragraph",
        data: {
          hName: "div",
          hProperties: {
            className: ["live-photo-frame"],
            ...(alt ? { role: "img", "aria-label": alt } : {}),
            "data-live-photo-frame": "true"
          }
        },
        children: [
          {
            type: "paragraph",
            data: {
              hName: "div",
              hProperties: {
                className: ["live-photo-player"],
                "data-live-photo": "true",
                "data-live-photo-target": "true",
                "data-photo-src": src,
                "data-video-src": live,
                ...(photoTime ? { "data-photo-time": photoTime } : {}),
                ...(liveControls ? { "data-shows-native-controls": liveControls } : {}),
                ...(livePreload ? { "data-proactively-loads-video": livePreload } : {})
              }
            },
            children: []
          },
          {
            ...imageNode,
            data: {
              hProperties: {
                ...imageNode.data.hProperties,
                className: ["image-block-media", "live-photo-fallback"]
              }
            }
          }
        ]
      }
    : undefined;
  const baseMediaNode = livePlayerNode ?? imageNode;
  const mediaNode = href
    ? {
        type: "link",
        url: href,
        children: [baseMediaNode],
        data: {
          hProperties: {
            className: ["image-block-link"]
          }
      }
    }
    : baseMediaNode;

  node.data = {
    hName: "figure",
    hProperties: {
      className: ["image-block", ...(live ? ["image-block-live"] : [])],
      style: `--image-scale: ${scale}%;${live ? ` --image-ratio: ${ratio};` : ""}`,
      "data-scale": String(scale),
      ...(live ? { "data-live": "true", "data-live-src": live, "data-live-photo-src": src } : {})
    }
  };

  node.children = [mediaNode];

  if (caption || credit) {
    node.children.push({
      type: "paragraph",
      data: {
        hName: "figcaption",
        hProperties: {
          className: ["image-block-caption"]
        }
      },
      children: [
        ...(caption ? [{ type: "text", value: caption }] : []),
        ...(caption && credit ? [{ type: "text", value: " · " }] : []),
        ...(credit
          ? [
              {
                type: "text",
                value: credit
              }
            ]
          : [])
      ]
    });
  }
}

function transformCallout(node) {
  const type = node.name === "tip" ? "tips" : node.name;
  const title = getDirectiveLabel(node, calloutLabels[node.name]);

  node.data = {
    hName: "aside",
    hProperties: {
      className: ["callout", `callout-${type}`],
      "data-callout": type
    }
  };

  node.children.unshift({
    type: "paragraph",
    data: {
      hName: "p",
      hProperties: {
        className: ["callout-title"]
      }
    },
    children: [{ type: "text", value: title }]
  });
}

function transformDetails(node) {
  const title = getDirectiveLabel(node, "Details");

  node.data = {
    hName: "details",
    hProperties: {
      className: ["details-block"],
      ...(isOpenDetails(node) ? { open: true } : {})
    }
  };

  node.children.unshift({
    type: "paragraph",
    data: {
      hName: "summary",
      hProperties: {
        className: ["details-summary"]
      }
    },
    children: [{ type: "text", value: title }]
  });
}

function transformTabs(node, tabSetId) {
  const tabs = node.children?.filter((child) => child.type === "containerDirective" && child.name === "tab") ?? [];

  if (tabs.length === 0) return;

  node.data = {
    hName: "div",
    hProperties: {
      className: ["tabs-block"]
    }
  };

  node.children = tabs.flatMap((tab, index) => {
    const tabId = `${tabSetId}-${index + 1}`;
    const title = escapeHtml(getDirectiveLabel(tab, `Tab ${index + 1}`));
    const checked = index === 0 ? " checked" : "";

    return [
      {
        type: "html",
        value: `<input class="tabs-input" type="radio" id="${tabId}" name="${tabSetId}"${checked}>`
      },
      {
        type: "html",
        value: `<label class="tabs-label" for="${tabId}">${title}</label><div class="tabs-panel">`
      },
      ...tab.children,
      {
        type: "html",
        value: "</div>"
      }
    ];
  });
}

export default function remarkCallouts() {
  let tabSetIndex = 0;

  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective") return;

      if (calloutTypes.has(node.name)) {
        transformCallout(node);
        return;
      }

      if (node.name === "details") {
        transformDetails(node);
        return;
      }

      if (node.name === "img") {
        transformImage(node);
        return;
      }

      if (node.name === "tabs") {
        tabSetIndex += 1;
        transformTabs(node, `sorapaper-tabs-${tabSetIndex}`);
      }
    });
  };
}
