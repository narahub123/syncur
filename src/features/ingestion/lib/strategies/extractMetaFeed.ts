import { load } from "cheerio";

/**
 * Meta tag / structured data 기반 RSS 추론
 *
 * 역할:
 * - 마지막 fallback RSS discovery
 * - weak signal 기반 탐색
 */
export function extractMetaFeed(html: string): string[] {
  const $ = load(html);

  const feeds: string[] = [];

  /**
   * 1. standard RSS/Atom link tag
   */
  $('link[type="application/rss+xml"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) feeds.push(href);
  });

  $('link[type="application/atom+xml"]').each((_, el) => {
    const href = $(el).attr("href");
    if (href) feeds.push(href);
  });

  /**
   * 2. generic alternate feeds
   */
  $('link[rel="alternate"]').each((_, el) => {
    const type = ($(el).attr("type") || "").toLowerCase();
    const href = $(el).attr("href");

    if (!href) return;

    if (type.includes("rss") || type.includes("xml")) {
      feeds.push(href);
    }
  });

  return dedupe(feeds);
}

/**
 * 중복 제거
 */
function dedupe(arr: string[]): string[] {
  return [...new Set(arr)];
}
