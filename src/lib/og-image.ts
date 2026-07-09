import { themeConfig } from "@/config/theme";
import { formatDate, getPostSummary, type BlogPost } from "@/lib/posts";

const width = 1200;
const height = 630;

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function truncate(value: string, maxLength: number) {
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function wrapText(value: string, maxCharsPerLine: number, maxLines: number) {
  const normalized = value.trim().replace(/\s+/g, " ");
  const lines: string[] = [];
  let current = "";

  for (const char of normalized) {
    if ((current + char).length > maxCharsPerLine) {
      const breakAt = current.lastIndexOf(" ");
      if (breakAt > 0 && char !== " ") {
        lines.push(current.slice(0, breakAt));
        current = `${current.slice(breakAt + 1)}${char}`;
      } else {
        lines.push(current.trim());
        current = char.trimStart();
      }
      if (lines.length === maxLines) break;
    } else {
      current += char;
    }
  }

  if (lines.length < maxLines && current) lines.push(current.trim());
  if (normalized.length > lines.join("").length && lines.length > 0) {
    lines[lines.length - 1] = truncate(lines[lines.length - 1], Math.max(1, lines[lines.length - 1].length));
  }

  return lines;
}

function renderTextLines(lines: string[], options: { x: number; y: number; lineHeight: number; className: string }) {
  return lines
    .map((line, index) => (
      `<text x="${options.x}" y="${options.y + index * options.lineHeight}" class="${options.className}">${escapeXml(line)}</text>`
    ))
    .join("");
}

function renderTags(tags: string[]) {
  return tags.slice(0, 3).map((tag, index) => {
    const label = truncate(tag, 14);
    const pillWidth = Math.max(92, label.length * 18 + 38);
    const x = 132 + index * 142;

    return `
      <g transform="translate(${x} 542)">
        <rect width="${pillWidth}" height="46" rx="23" class="pill" />
        <text x="24" y="30" class="tag">${escapeXml(label)}</text>
      </g>`;
  }).join("");
}

export function renderPostOgImage(post: BlogPost) {
  const titleLines = wrapText(post.data.title, post.data.lang === "zh" ? 18 : 28, 2);
  const summaryLines = wrapText(getPostSummary(post), post.data.lang === "zh" ? 34 : 58, 2);
  const date = formatDate(post.data.pubDate, post.data.lang);
  const category = post.data.category;
  const cover = post.data.cover?.src;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeXml(post.data.title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fbf8f3" />
      <stop offset="52%" stop-color="#f4f0ff" />
      <stop offset="100%" stop-color="#eaf8ff" />
    </linearGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.58" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="28" flood-color="#505a82" flood-opacity="0.16" />
    </filter>
  </defs>
  <style>
    .brand { fill: #27304a; font: 700 38px Georgia, "Noto Serif SC", serif; }
    .eyebrow { fill: #6f7890; font: 500 26px Inter, system-ui, sans-serif; }
    .title { fill: #27304a; font: 700 76px Georgia, "Noto Serif SC", serif; letter-spacing: -1px; }
    .summary { fill: #6f7890; font: 400 28px Inter, "Noto Sans SC", system-ui, sans-serif; }
    .tag { fill: #6d6de8; font: 700 22px Inter, "Noto Sans SC", system-ui, sans-serif; }
    .pill { fill: rgba(139, 140, 246, 0.12); stroke: rgba(139, 140, 246, 0.25); }
    .small { fill: #8b8cf6; font: 700 22px Inter, system-ui, sans-serif; }
  </style>
  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="1030" cy="120" r="210" fill="#83c5f7" opacity="0.22" />
  <circle cx="140" cy="540" r="220" fill="#8b8cf6" opacity="0.16" />
  <circle cx="1010" cy="520" r="170" fill="#f2b8d1" opacity="0.22" />
  ${cover ? `<image href="${escapeXml(cover)}" x="720" y="168" width="348" height="236" opacity="0.42" preserveAspectRatio="xMidYMid slice" />` : ""}
  <path d="M954 134 L1098 76 L1044 210 L1017 158 Z" fill="#ffffff" opacity="0.78" />
  <path d="M954 134 L1017 158 L1044 210 L1030 146 Z" fill="#b7a8ff" opacity="0.45" />
  <text x="88" y="83" class="brand">${escapeXml(themeConfig.name)}</text>
  <rect x="70" y="112" width="1060" height="490" rx="46" fill="url(#card)" stroke="rgba(255,255,255,0.82)" stroke-width="3" filter="url(#shadow)" />
  <text x="132" y="185" class="eyebrow">${escapeXml(date)} · ${escapeXml(category)}</text>
  ${renderTextLines(titleLines, { x: 132, y: 286, lineHeight: 84, className: "title" })}
  <line x1="132" y1="438" x2="642" y2="438" stroke="#8b8cf6" stroke-opacity="0.36" stroke-width="2" />
  ${renderTextLines(summaryLines, { x: 132, y: 478, lineHeight: 38, className: "summary" })}
  ${renderTags(post.data.tags)}
  <text x="950" y="570" class="small">by ${escapeXml(themeConfig.author.name)}</text>
</svg>`;
}
