import { randomBytes, createCipheriv, pbkdf2Sync } from "node:crypto";
import { toHtml } from "hast-util-to-html";

const algorithm = "AES-256-GCM";
const kdf = "PBKDF2-SHA-256";
const iterations = 250000;
const version = 1;

function isAstroBuild() {
  return process.argv.some((argument) => argument === "build");
}

function visit(node, callback) {
  callback(node);

  if (!Array.isArray(node.children)) return;

  for (const child of node.children) {
    visit(child, callback);
  }
}

function getProperty(node, key) {
  const value = node.properties?.[key];
  return typeof value === "string" ? value.trim() : undefined;
}

function getPassphraseMap() {
  const raw = process.env.SORAPAPER_ENCRYPTION_KEYS;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => typeof value === "string" && value.length > 0)
    );
  } catch {
    throw new Error("SORAPAPER_ENCRYPTION_KEYS must be a JSON object, for example {\"default\":\"passphrase\"}.");
  }
}

function getEnvKeyName(keyId) {
  return `SORAPAPER_ENCRYPTION_KEY_${keyId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}`;
}

function resolvePassphrase(keyId, inlinePassphrase) {
  if (inlinePassphrase) return inlinePassphrase;

  const passphraseMap = getPassphraseMap();
  return passphraseMap[keyId] ?? process.env[getEnvKeyName(keyId)] ?? (keyId === "default" ? process.env.SORAPAPER_ENCRYPTION_KEY : undefined);
}

function encryptHtml(html, keyId, blockId, passphrase) {
  if (!passphrase) {
    throw new Error(
      `Missing passphrase for :::encrypted key "${keyId}". Set password on the directive, SORAPAPER_ENCRYPTION_KEYS, ${getEnvKeyName(keyId)} or SORAPAPER_ENCRYPTION_KEY for the default key.`
    );
  }

  const salt = randomBytes(16);
  const iv = randomBytes(12);
  const aad = `sorapaper:encrypted-block:v${version}:${keyId}:${blockId}`;
  const key = pbkdf2Sync(passphrase, salt, iterations, 32, "sha256");
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(aad, "utf8"));
  const encrypted = Buffer.concat([cipher.update(html, "utf8"), cipher.final(), cipher.getAuthTag()]);

  return {
    version,
    algorithm,
    kdf,
    iterations,
    keyId,
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    aad,
    ciphertext: encrypted.toString("base64")
  };
}

function getMissingPassphraseMessage(keyId) {
  return `Missing passphrase for :::encrypted key "${keyId}". Set password on the directive, SORAPAPER_ENCRYPTION_KEYS, ${getEnvKeyName(keyId)} or SORAPAPER_ENCRYPTION_KEY for the default key.`;
}

function text(value) {
  return { type: "text", value };
}

function span(lang, value) {
  return {
    type: "element",
    tagName: "span",
    properties: { "data-lang": lang },
    children: [text(value)]
  };
}

function bilingual(zh, en) {
  return [span("zh", zh), span("en", en)];
}

function createEncryptedBlock(node, payload) {
  const keyId = getProperty(node, "data-encrypted-key") ?? "default";
  const sharedKey = getProperty(node, "data-encrypted-shared") === "true";
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString("base64");

  node.tagName = "section";
  node.properties = {
    className: ["encrypted-block"],
    "data-encrypted-block": "true",
    "data-encrypted-key": keyId,
    ...(sharedKey ? { "data-encrypted-shared": "true" } : {}),
    "data-encrypted-payload": encodedPayload
  };
  node.children = [
    {
      type: "element",
      tagName: "div",
      properties: { className: ["encrypted-block-inner"] },
      children: [
        {
          type: "element",
          tagName: "div",
          properties: { className: ["encrypted-block-header"] },
          children: [
            {
              type: "element",
              tagName: "p",
              properties: { className: ["encrypted-block-title"] },
              children: bilingual("加密内容", "Encrypted content")
            }
          ]
        },
        {
          type: "element",
          tagName: "form",
          properties: { className: ["encrypted-block-form"], "data-encrypted-form": "true" },
          children: [
            {
              type: "element",
              tagName: "label",
              properties: { className: ["encrypted-block-label"] },
              children: [
                ...bilingual("输入密码", "Enter passphrase"),
                {
                  type: "element",
                  tagName: "input",
                  properties: {
                    type: "password",
                    autocomplete: "current-password",
                    required: true,
                    "data-encrypted-password": "true"
                  },
                  children: []
                }
              ]
            },
            {
              type: "element",
              tagName: "button",
              properties: { type: "submit" },
              children: bilingual("解锁", "Unlock")
            },
            {
              type: "element",
              tagName: "p",
              properties: { className: ["encrypted-block-status"], "data-encrypted-status": "true", role: "status", "aria-live": "polite" },
              children: []
            }
          ]
        }
      ]
    },
    {
      type: "element",
      tagName: "div",
      properties: { className: ["encrypted-block-content"], "data-encrypted-content": "true", hidden: true },
      children: []
    },
    {
      type: "element",
      tagName: "noscript",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "p",
          properties: {},
          children: bilingual("需要启用 JavaScript 才能解锁此内容。", "JavaScript is required to unlock this content.")
        }
      ]
    }
  ];
}

function createUnconfiguredBlock(node, keyId) {
  node.tagName = "section";
  node.properties = {
    className: ["encrypted-block", "is-unconfigured"],
    "data-encrypted-block": "true",
    "data-encrypted-key": keyId
  };
  node.children = [
    {
      type: "element",
      tagName: "div",
      properties: { className: ["encrypted-block-header"] },
      children: [
        {
          type: "element",
          tagName: "p",
          properties: { className: ["encrypted-block-title"] },
          children: bilingual("加密内容未配置", "Encrypted content is not configured")
        },
        {
          type: "element",
          tagName: "p",
          properties: { className: ["encrypted-block-hint"] },
          children: [
            span("zh", `开发环境缺少 directive password 或 ${getEnvKeyName(keyId)}，因此不会输出块内明文。`),
            span("en", `The development environment is missing a directive password or ${getEnvKeyName(keyId)}, so the plaintext is not rendered.`)
          ]
        }
      ]
    }
  ];
}

export default function rehypeEncrypted() {
  return (tree) => {
    let blockIndex = 0;

    visit(tree, (node) => {
      if (node.type !== "element" || getProperty(node, "data-encrypted-source") !== "true") return;

      blockIndex += 1;
      const keyId = getProperty(node, "data-encrypted-key") ?? "default";
      const inlinePassphrase = getProperty(node, "data-encrypted-passphrase");
      const blockId = `block-${blockIndex}`;
      const html = toHtml({ type: "root", children: node.children ?? [] }, { allowDangerousHtml: true });
      const passphrase = resolvePassphrase(keyId, inlinePassphrase);

      if (!passphrase) {
        if (isAstroBuild()) {
          throw new Error(getMissingPassphraseMessage(keyId));
        }

        createUnconfiguredBlock(node, keyId);
        return;
      }

      const payload = encryptHtml(html, keyId, blockId, passphrase);

      createEncryptedBlock(node, payload);
    });
  };
}
