import { load } from "cheerio";

/**
 * HTML <head>에서 RSS/Atom feed 추출
 *
 * 가장 신뢰도 높은 RSS discovery 방식
 * (사이트가 직접 선언한 feed)
 */
export function extractRelFeed(html: string): string[] {
  const $ = load(html);

  const feeds: string[] = [];

  /**
   * <link rel="alternate" type="application/rss+xml">
   * <link rel="alternate" type="application/atom+xml">
   */
  $("link").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase();
    const type = ($(el).attr("type") || "").toLowerCase();
    const href = $(el).attr("href");

    if (!href) return;

    const isRSS =
      rel.includes("alternate") &&
      (type.includes("rss") || type.includes("atom") || type.includes("xml"));

    if (isRSS) {
      feeds.push(href);
    }
  });

  return feeds;
}
