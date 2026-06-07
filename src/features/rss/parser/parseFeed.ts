import { parseStringPromise } from "xml2js";
import { ParsedFeedItem, RawRssItem } from "./types";

/**
 * RSS / Atom XML → ParsedFeedItem[] 변환
 *
 * 역할:
 * - RSS / Atom 통합 처리
 * - 구조 normalize
 * - Syncur 내부 표준 포맷으로 변환
 */
export async function parseAndNormalizeFeed(
  xml: string,
): Promise<ParsedFeedItem[]> {
  const raw = await parseStringPromise(xml, {
    explicitArray: false,
    trim: true,
  });

  /**
   * RSS
   */
  if ("rss" in raw) {
    const item = raw.rss?.channel?.item ?? [];

    return normalizeRss(Array.isArray(item) ? item : [item]);
  }

  /**
   * Atom (핵심 수정)
   */
  if ("feed" in raw) {
    const feed = raw.feed;

    // 🔥 핵심: entry 무조건 안전화
    const entry = feed?.entry ?? [];

    return normalizeAtom(Array.isArray(entry) ? entry : [entry]);
  }

  return [];
}

/**
 * RSS 2.0 → ParsedFeedItem 변환
 */
function normalizeRss(items: RawRssItem | RawRssItem[]): ParsedFeedItem[] {
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => ({
    title: safeText(item.title),
    link: safeText(item.link),
    publishedAt: parseDate(item.pubDate || item.published || item.date),
  }));
}

/**
 * Atom → ParsedFeedItem 변환
 */
function normalizeAtom(entries: unknown): ParsedFeedItem[] {
  const list = Array.isArray(entries) ? entries : [entries];

  return list
    .map((entry) => {
      const title = entry?.title?.["#text"] || entry?.title || "";

      const link = entry?.link?.href || entry?.link || entry?.id || "";

      const publishedAt = entry?.updated || entry?.published || null;

      return {
        title,
        link,
        publishedAt,
      };
    })
    .filter((item) => item.link); // 🔥 title 기준 제거
}

/**
 * 안전한 텍스트 처리
 */
function safeText(value?: string | number | null): string {
  if (!value) return "";
  return typeof value === "string" ? value : String(value);
}

/**
 * 날짜 파싱 안전 처리
 */
function parseDate(value?: string | null): Date | undefined {
  if (!value) return undefined;

  const date = new Date(value);
  if (isNaN(date.getTime())) return undefined;

  return date;
}
