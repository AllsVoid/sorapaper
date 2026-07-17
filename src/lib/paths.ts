import { themeConfig } from "@/config/theme";

const externalPattern = /^(?:[a-z][a-z\d+.-]*:|\/\/)/i;

export function getBasePath() {
  const base = themeConfig.site.base.trim();
  if (!base || base === "/") return "";
  return `/${base.replace(/^\/+|\/+$/g, "")}`;
}

export function withBase(path = "/") {
  if (!path || path.startsWith("#") || externalPattern.test(path)) return path;

  const base = getBasePath();
  if (!base) return path;

  if (path === "/") return `${base}/`;
  if (path === base || path.startsWith(`${base}/`)) return path;
  if (path.startsWith("/")) return `${base}${path}`;
  return path;
}

export function withoutBase(path = "/") {
  const base = getBasePath();
  if (!base || !path.startsWith(base)) return path;

  const nextPath = path.slice(base.length);
  return nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
}

export function absoluteUrl(path = "/") {
  return new URL(withBase(path), themeConfig.site.url).toString();
}
