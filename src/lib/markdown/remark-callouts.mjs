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

      if (node.name === "tabs") {
        tabSetIndex += 1;
        transformTabs(node, `sorapaper-tabs-${tabSetIndex}`);
      }
    });
  };
}
