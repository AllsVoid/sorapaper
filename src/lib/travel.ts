import { getCollection, type CollectionEntry } from "astro:content";
import { withBase } from "@/lib/paths";
import type { Locale } from "@/i18n/config";

export type TravelEntry = CollectionEntry<"travel">;

export async function getPublishedTravels(locale?: Locale) {
  const travels = await getCollection("travel", ({ data }) => !data.draft);
  return travels
    .filter((travel) => !locale || travel.data.lang === locale)
    .sort((a, b) => b.data.startDate.getTime() - a.data.startDate.getTime());
}

export function getTravelSlug(travel: TravelEntry) {
  return travel.data.slug ?? travel.id.replace(/\.(md|mdx)$/i, "");
}

export function getTravelHref(travel: TravelEntry) {
  return withBase(`/travel/${getTravelSlug(travel)}/`);
}

export function getTravelDays(travel: TravelEntry) {
  return Math.floor((travel.data.endDate.getTime() - travel.data.startDate.getTime()) / 86_400_000) + 1;
}

export function formatTravelDateRange(travel: TravelEntry, locale: Locale) {
  const formatter = new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en", { year: "numeric", month: "short", day: "numeric" });
  return `${formatter.format(travel.data.startDate)} — ${formatter.format(travel.data.endDate)}`;
}
