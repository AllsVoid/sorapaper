function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, callback);
  }
}

function toText(node) {
  if (node.type === "text" || node.type === "inlineCode" || node.type === "code") return node.value ?? "";
  if (!Array.isArray(node.children)) return "";
  return node.children.map((child) => toText(child)).join("");
}

function trimLineBreaks(value) {
  return value.replace(/^(?:\r?\n)+/, "").replace(/(?:\r?\n)+$/, "");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeMermaidSource(value) {
  return escapeHtml(value).replace(/(^|\n)([ \t]+)/g, (_, lineBreak, indent) => {
    return `${lineBreak}${indent.replace(/ /g, "&#32;").replace(/\t/g, "&#9;")}`;
  });
}

function getDirectiveLabel(node) {
  const firstChild = node.children?.[0];

  if (
    firstChild?.type === "paragraph" &&
    firstChild.data?.directiveLabel &&
    firstChild.children?.length > 0
  ) {
    const title = firstChild.children
      .filter((child) => child.type === "text" || child.type === "inlineCode")
      .map((child) => child.value)
      .join("")
      .trim();

    if (title) return title;
  }

  return undefined;
}

function extractDirectiveBody(node, file) {
  const value = String(file.value ?? "");
  const startLine = node.position?.start?.line;
  const endLine = node.position?.end?.line;
  const startOffset = node.position?.start?.offset;
  const endOffset = node.position?.end?.offset;

  if (Number.isInteger(startLine) && Number.isInteger(endLine) && startLine < endLine) {
    const body = trimLineBreaks(value.split(/\r?\n/).slice(startLine, endLine - 1).join("\n"));
    if (body) return body;
  }

  if (Number.isInteger(startOffset) && Number.isInteger(endOffset)) {
    const rawDirective = value.slice(startOffset, endOffset);
    const lines = rawDirective.split(/\r?\n/);
    lines.shift();

    const closingIndex = lines.findLastIndex((line) => /^\s*:{3,}\s*$/.test(line));
    const bodyLines = closingIndex >= 0 ? lines.slice(0, closingIndex) : lines;
    const body = trimLineBreaks(bodyLines.join("\n"));

    if (body) return body;
  }

  return trimLineBreaks((node.children ?? []).map((child) => toText(child)).join("\n\n"));
}

function transformMermaid(node, file) {
  const source = extractDirectiveBody(node, file);
  if (!source) return;

  const title = getDirectiveLabel(node);

  node.data = {
    hName: "figure",
    hProperties: {
      className: ["mermaid-block"],
      "data-mermaid-block": "true",
      ...(title ? { "aria-label": title } : {})
    }
  };

  node.children = [
    ...(title ? [{ type: "html", value: `<figcaption class="mermaid-caption">${escapeHtml(title)}</figcaption>` }] : []),
    {
      type: "html",
      value: '<div class="mermaid-render" data-mermaid-render="true" aria-hidden="true"></div>'
    },
    {
      type: "html",
      value: `<pre class="mermaid-source" data-mermaid-source="true">${escapeMermaidSource(source)}</pre>`
    }
  ];
}

export default function remarkMermaid() {
  return (tree, file) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || node.name !== "mermaid") return;
      transformMermaid(node, file);
    });
  };
}
