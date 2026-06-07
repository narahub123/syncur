import { ParsedFeedItem } from "../parser/types";

/**
 * RSS Feed scoring engine
 *
 * 역할:
 * - 여러 RSS 후보 중 "가장 신뢰할 수 있는 feed" 선택
 * - 구조 안정성 + 접근성 + 품질 기반 점수화
 */
export function scoreFeeds(feedUrl: string, feed: ParsedFeedItem[]): number {
  let score = 0;

  /**
   * 1. URL 기반 점수
   */

  // HTTPS 우선
  if (feedUrl.startsWith("https")) {
    score += 10;
  }

  // clean path (/feed, /rss 등)
  if (isCleanPath(feedUrl)) {
    score += 20;
  }

  // query string 없는 URL
  if (!feedUrl.includes("?")) {
    score += 5;
  }

  /**
   * 2. 콘텐츠 기반 점수
   */

  // item 개수 (RSS 품질의 핵심 지표)
  const itemCount = feed.length;

  if (itemCount >= 10) {
    score += 10;
  } else if (itemCount >= 5) {
    score += 5;
  }

  /**
   * 3. freshness 기반 점수
   * (최근 업데이트가 있는 feed 우선)
   */
  const hasRecentItem = feed.some((item) => {
    if (!item.publishedAt) return false;

    const diff = Date.now() - new Date(item.publishedAt).getTime();

    // 7일 이내
    return diff < 1000 * 60 * 60 * 24 * 7;
  });

  if (hasRecentItem) {
    score += 10;
  }

  /**
   * 4. 구조 안정성 점수
   */

  if (looksLikeAtom(feedUrl)) {
    score += 5;
  }

  if (looksLikeRss(feedUrl)) {
    score += 3;
  }

  /**
   * 5. 페널티
   */

  // 너무 짧은 feed (거의 empty)
  if (itemCount === 0) {
    score -= 50;
  }

  // HTML fallback feed (잘못된 RSS)
  if (looksLikeHtmlFeed(feedUrl)) {
    score -= 100;
  }

  return score;
}

/**
 * clean path 판단
 */
function isCleanPath(url: string): boolean {
  return url.includes("/feed") || url.includes("/rss") || url.includes("/atom");
}

/**
 * Atom feed heuristic
 */
function looksLikeAtom(url: string): boolean {
  return url.includes("atom");
}

/**
 * RSS feed heuristic
 */
function looksLikeRss(url: string): boolean {
  return url.includes("rss");
}

/**
 * invalid feed heuristic
 */
function looksLikeHtmlFeed(url: string): boolean {
  return url.includes("login") || url.includes("redirect");
}
