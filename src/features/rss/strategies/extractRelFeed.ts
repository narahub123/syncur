import { load } from "cheerio";

/**
 * HTML <head>에서 RSS/Atom feed 후보 추출
 *
 * 핵심 원칙:
 * - strict validation 금지
 * - 후보 수집만 담당
 * - 최종 판단은 validateAndScore에서 수행
 */
export function extractRelFeed(html: string): string[] {
  const $ = load(html);

  const feeds: string[] = [];

  $("link").each((_, el) => {
    const rel = ($(el).attr("rel") || "").toLowerCase();
    const type = ($(el).attr("type") || "").toLowerCase();
    const href = $(el).attr("href");

    if (!href) return;

    /**
     * 핵심 변경:
     * - OR 기반 loose detection
     * - "rss/atom/xml/feed" 힌트만 있으면 후보로 포함
     */
    const isCandidate =
      rel.includes("rss") ||
      rel.includes("atom") ||
      rel.includes("alternate") ||
      type.includes("rss") ||
      type.includes("atom") ||
      type.includes("xml") ||
      href.includes("rss") ||
      href.includes("feed") ||
      href.includes("atom") ||
      href.endsWith(".xml");

    if (isCandidate) {
      feeds.push(href);
    }
  });

  /**
   * 중복 제거 (필수)
   */
  return [...new Set(feeds)];
}
