function getStringAttribute(node, key) {
  const value = node.attributes?.[key];
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();
  return trimmed || undefined;
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

    node.children.shift();
    if (title) return title;
  }

  return undefined;
}

function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, callback);
  }
}

function transformEncryptedBlock(node) {
  const explicitKey = getStringAttribute(node, "key") ?? getStringAttribute(node, "keyId");
  const keyId = explicitKey ?? "default";
  const passphrase = getStringAttribute(node, "password") ?? getStringAttribute(node, "passphrase");
  const label = getDirectiveLabel(node);
  const hint = getStringAttribute(node, "hint") ?? label;

  node.data = {
    hName: "div",
    hProperties: {
      className: ["encrypted-block-source"],
      "data-encrypted-source": "true",
      "data-encrypted-key": keyId,
      ...(explicitKey ? { "data-encrypted-shared": "true" } : {}),
      ...(passphrase ? { "data-encrypted-passphrase": passphrase } : {}),
      ...(hint ? { "data-encrypted-hint": hint } : {})
    }
  };
}

export default function remarkEncrypted() {
  return (tree) => {
    visit(tree, (node) => {
      if (node.type !== "containerDirective" || node.name !== "encrypted") return;
      transformEncryptedBlock(node);
    });
  };
}
