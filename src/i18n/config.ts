export const defaultLocale = "zh";

export const locales = ["zh", "en"] as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  zh: "中文",
  en: "English"
};

export function isLocale(value: string | undefined): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export function getLocaleFromParams(params: Record<string, string | undefined>) {
  return isLocale(params.lang) ? params.lang : defaultLocale;
}

export function localizePath(_locale: Locale, path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized;
}

export function switchLocalePath(targetLocale: Locale, currentPath: string) {
  const url = new URL(currentPath, "https://example.com");
  url.searchParams.set("lang", targetLocale);
  return `${url.pathname}${url.search}`;
}
