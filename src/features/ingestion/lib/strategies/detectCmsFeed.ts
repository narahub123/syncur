import { load, CheerioAPI } from "cheerio";

/**
 * CMS 기반 RSS 추론 전략
 *
 * 역할:
 * - rel / probe 실패한 사이트에서 RSS 추측
 * - CMS 패턴 기반 feed URL 생성
 */
export function detectCmsFeed(baseUrl: string, html: string): string[] {
  const $ = load(html);
  const feeds: string[] = [];

  const url = new URL(baseUrl);
  const origin = url.origin;

  /**
   * 1. WordPress detection
   * - 가장 강력한 RSS source
   */
  if (isWordPress(html)) {
    feeds.push(
      `${origin}/feed`,
      `${origin}/rss`,
      `${origin}/feed/rss`,
      `${origin}/wp-json/wp/v2/posts`,
    );
  }

  /**
   * 2. Medium detection
   */
  if (isMedium(html)) {
    feeds.push(`${origin}/feed`);
  }

  /**
   * 3. Ghost CMS detection
   */
  if (isGhost(html)) {
    feeds.push(`${origin}/rss/`);
  }

  /**
   * 4. Notion blog detection (public notion sites)
   */
  if (isNotion(html)) {
    feeds.push(`${origin}/rss.xml`);
  }

  /**
   * 5. fallback heuristic (meta hints)
   */
  const metaFeed = extractMetaFeedHint($);
  if (metaFeed) {
    feeds.push(metaFeed);
  }

  return dedupe(feeds);
}

function isWordPress(html: string): boolean {
  return (
    html.includes("wp-content") ||
    html.includes("wp-includes") ||
    html.includes("wordpress")
  );
}

function isMedium(html: string): boolean {
  return html.includes("medium.com") || html.includes("cdn-client.medium.com");
}

function isGhost(html: string): boolean {
  return html.includes("ghost") || html.includes("ghost.org");
}

function isNotion(html: string): boolean {
  return html.includes("notion") && html.includes("og:site_name");
}

function dedupe(arr: string[]): string[] {
  return [...new Set(arr)];
}

function extractMetaFeedHint($: CheerioAPI): string | null {
  const href = $('link[type="application/rss+xml"]').attr("href");

  if (href) return href;

  return null;
}
