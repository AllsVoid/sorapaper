const lineSpecPattern = /(\d+)(?:-(\d+))?/g;
const metaValuePattern = (key) =>
  new RegExp(`(?:^|\\s)${key}(?:=|:)(?:"([^"]*)"|'([^']*)'|([^\\s]+))`, "i");

function appendClass(node, className) {
  const current = node.properties?.className;
  const next = Array.isArray(current)
    ? current
    : typeof current === "string"
      ? current.split(/\s+/).filter(Boolean)
      : [];

  if (!next.includes(className)) next.push(className);

  node.properties = {
    ...node.properties,
    className: next
  };
}

function visitParents(node, callback, ancestors = []) {
  callback(node, ancestors);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visitParents(child, callback, [...ancestors, node]);
  }
}

function toText(node) {
  if (node.type === "text") return node.value ?? "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map((child) => toText(child)).join("");
}

function getMetaValue(meta, keys) {
  for (const key of keys) {
    const match = metaValuePattern(key).exec(meta);
    const value = match?.[1] ?? match?.[2] ?? match?.[3];
    if (value) return value.trim();
  }

  return undefined;
}

function hasMetaFlag(meta, key) {
  return new RegExp(`(?:^|\\s)${key}(?:\\s|$)`, "i").test(meta);
}

function parseLineSpec(value) {
  const lines = new Set();
  if (!value) return lines;

  for (const match of value.matchAll(lineSpecPattern)) {
    const start = Number(match[1]);
    const end = Number(match[2] ?? match[1]);

    if (!Number.isInteger(start) || !Number.isInteger(end)) continue;

    for (let line = Math.min(start, end); line <= Math.max(start, end); line += 1) {
      lines.add(line);
    }
  }

  return lines;
}

function parseCommandPrompts(meta) {
  const prompts = new Map();
  const pattern = /command:\((["'])(.*?)\1:([^)]+)\)/gi;

  for (const match of meta.matchAll(pattern)) {
    const prompt = match[2];
    const lines = parseLineSpec(match[3]);

    for (const line of lines) {
      prompts.set(line, prompt);
    }
  }

  const prompt = getMetaValue(meta, ["prompt"]);
  const promptLines = parseLineSpec(getMetaValue(meta, ["promptLines", "commandLines"]));
  if (prompt && promptLines.size > 0) {
    for (const line of promptLines) {
      prompts.set(line, prompt);
    }
  }

  return prompts;
}

function getObjectMetaValue(rawMeta, keys) {
  if (!rawMeta || typeof rawMeta !== "object") return undefined;

  for (const key of keys) {
    const value = rawMeta[key];
    if (value === undefined || value === null || key.startsWith("_")) continue;
    return String(value).trim();
  }

  return undefined;
}

function getAnyMetaValue(rawMeta, meta, keys) {
  return getMetaValue(meta, keys) ?? getObjectMetaValue(rawMeta, keys);
}

function parseCodeBlockMeta(rawMeta = "") {
  const rawValue = rawMeta && typeof rawMeta === "object" && "__raw" in rawMeta ? rawMeta.__raw : rawMeta;
  const meta = typeof rawValue === "string" ? rawValue : String(rawValue ?? "");
  const title = getAnyMetaValue(rawMeta, meta, ["title", "file", "filename"]);
  const url = getAnyMetaValue(rawMeta, meta, ["url", "href"]);
  const linkText = getAnyMetaValue(rawMeta, meta, ["linkText", "link"]);
  const mark = getAnyMetaValue(rawMeta, meta, ["mark", "highlight"]);
  const insert = getAnyMetaValue(rawMeta, meta, ["ins", "add"]);
  const remove = getAnyMetaValue(rawMeta, meta, ["del", "remove"]);
  const lineNumbersValue = getAnyMetaValue(rawMeta, meta, ["lineNumbers"]);
  const commandPrompts = parseCommandPrompts(meta);
  const prompt = getObjectMetaValue(rawMeta, ["prompt"]);
  const promptLines = parseLineSpec(getObjectMetaValue(rawMeta, ["promptLines", "commandLines"]));

  if (prompt && promptLines.size > 0) {
    for (const line of promptLines) {
      commandPrompts.set(line, prompt);
    }
  }

  return {
    title,
    url,
    linkText,
    markLines: parseLineSpec(mark),
    insertLines: parseLineSpec(insert),
    deleteLines: parseLineSpec(remove),
    commandPrompts,
    hideLineNumbers: hasMetaFlag(meta, "noLineNumbers") || lineNumbersValue === "false"
  };
}

function getLanguageLabel(language) {
  if (!language || language === "plaintext") return "TEXT";
  return language.toUpperCase();
}

function isDiffAddedLine(language, value) {
  return language === "diff" && value.startsWith("+") && !value.startsWith("+++");
}

function isDiffRemovedLine(language, value) {
  return language === "diff" && value.startsWith("-") && !value.startsWith("---");
}


export function createShikiCodeBlockTransformer(options = {}) {
  const lineNumbers = options.lineNumbers !== false;

  return {
    name: "sorapaper-code-blocks",
    pre(hast) {
      const meta = parseCodeBlockMeta(this.options.meta);
      const language = this.options.lang || "plaintext";

      appendClass(hast, "sorapaper-code-pre");
      if (lineNumbers && !meta.hideLineNumbers) appendClass(hast, "has-line-numbers");

      hast.properties = {
        ...hast.properties,
        "data-language": language,
        "data-title": meta.title ?? "",
        "data-code-title": meta.title ?? getLanguageLabel(language),
        ...(meta.url ? { "data-code-url": meta.url } : {}),
        ...(meta.linkText ? { "data-code-link-text": meta.linkText } : {})
      };
    },
    code(hast) {
      appendClass(hast, "sorapaper-code");
    },
    line(hast, line) {
      const meta = parseCodeBlockMeta(this.options.meta);
      const language = this.options.lang || "plaintext";
      const sourceLine = this.source.split(/\r?\n/)[line - 1] ?? "";
      const originalChildren = hast.children ?? [];
      const prompt = meta.commandPrompts.get(line);

      appendClass(hast, "sorapaper-code-line");
      hast.properties = {
        ...hast.properties,
        ...(lineNumbers && !meta.hideLineNumbers ? { "data-line": String(line) } : {})
      };
      hast.children = [
        ...(prompt
          ? [
              {
                type: "element",
                tagName: "span",
                properties: { className: ["code-line-prompt"], "aria-hidden": "true" },
                children: [{ type: "text", value: prompt }]
              }
            ]
          : []),
        {
          type: "element",
          tagName: "span",
          properties: { className: ["code-line-content"] },
          children: originalChildren
        }
      ];

      if (meta.markLines.has(line)) appendClass(hast, "is-highlighted");
      if (meta.insertLines.has(line) || isDiffAddedLine(language, sourceLine)) appendClass(hast, "is-inserted");
      if (meta.deleteLines.has(line) || isDiffRemovedLine(language, sourceLine)) appendClass(hast, "is-deleted");
      if (prompt) appendClass(hast, "has-command-prompt");
    }
  };
}

export function rehypeCodeBlockFrames(options = {}) {
  const copyButton = options.copyButton !== false;

  return (tree) => {
    visitParents(tree, (node, ancestors) => {
      if (node.type !== "element" || node.tagName !== "pre") return;
      if (!Array.isArray(node.children) || node.children.length === 0) return;

      const parent = ancestors.at(-1);
      if (!parent?.children) return;

      const className = node.properties?.className;
      const classes = Array.isArray(className) ? className : typeof className === "string" ? className.split(/\s+/) : [];
      if (!classes.includes("sorapaper-code-pre")) return;

      const title = String(node.properties?.["data-code-title"] ?? "CODE");
      const language = String(node.properties?.["data-language"] ?? "plaintext");
      const url = node.properties?.["data-code-url"];
      const linkText = String(node.properties?.["data-code-link-text"] ?? "Source");
      const code = node.children.find((child) => child.type === "element" && child.tagName === "code");
      const rawCode = code ? toText(code) : "";
      const index = parent.children.indexOf(node);

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["code-window"],
          "data-code-block": "true",
          "data-language": language
        },
        children: [
          {
            type: "element",
            tagName: "figcaption",
            properties: {
              className: ["code-window-header"]
            },
            children: [
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["code-window-lights"],
                  "aria-hidden": "true"
                },
                children: [
                  { type: "element", tagName: "span", properties: { className: ["code-window-light", "is-red"] }, children: [] },
                  { type: "element", tagName: "span", properties: { className: ["code-window-light", "is-yellow"] }, children: [] },
                  { type: "element", tagName: "span", properties: { className: ["code-window-light", "is-green"] }, children: [] }
                ]
              },
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["code-window-title"]
                },
                children: [{ type: "text", value: title }]
              },
              {
                type: "element",
                tagName: "span",
                properties: {
                  className: ["code-window-actions"]
                },
                children: [
                  ...(url
                    ? [
                        {
                          type: "element",
                          tagName: "a",
                          properties: {
                            className: ["code-window-link"],
                            href: url,
                            target: "_blank",
                            rel: "noreferrer"
                          },
                          children: [{ type: "text", value: linkText }]
                        }
                      ]
                    : []),
                  {
                    type: "element",
                    tagName: "button",
                    properties: {
                      className: ["code-window-button"],
                      type: "button",
                      "data-code-expand": "true",
                      "aria-label": "Toggle code block size"
                    },
                    children: [{ type: "text", value: "[]" }]
                  },
                  ...(copyButton
                    ? [
                        {
                          type: "element",
                          tagName: "button",
                          properties: {
                            className: ["code-window-button"],
                            type: "button",
                            "data-code-copy": "true",
                            "data-code": rawCode,
                            "aria-label": "Copy code"
                          },
                          children: [{ type: "text", value: "copy" }]
                        }
                      ]
                    : [])
                ]
              }
            ]
          },
          {
            type: "element",
            tagName: "div",
            properties: {
              className: ["code-window-body"]
            },
            children: [node]
          }
        ]
      };
    });
  };
}
