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

function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, callback);
  }
}

function getDirectiveLabel(node, type) {
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

  return calloutLabels[type];
}

export default function remarkCallouts() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || !calloutTypes.has(node.name)) return;

      const type = node.name === "tip" ? "tips" : node.name;
      const title = getDirectiveLabel(node, node.name);

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
    });
  };
}
