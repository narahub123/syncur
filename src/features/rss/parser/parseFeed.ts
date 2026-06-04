import { parseStringPromise } from "xml2js";
import type { FeedItem } from "@/shared/types/feed";
import { RawAtomEntry, RawRssItem } from "./types";

/**
 * XML parse 결과 최소 구조 타입
 */
type ParsedFeed =
  | {
      rss?: {
        channel?: {
          item?: RawRssItem | RawRssItem[];
        };
      };
    }
  | {
      feed?: {
        entry?: RawAtomEntry | RawAtomEntry[];
      };
    };

/**
 * RSS / Atom XML → FeedItem[] 변환
 *
 * 역할:
 * - RSS / Atom 통합 처리
 * - 구조 normalize
 * - Syncur 내부 표준 포맷으로 변환
 */
export async function parseAndNormalizeFeed(xml: string): Promise<FeedItem[]> {
  let parsed: ParsedFeed;

  try {
    parsed = await parseStringPromise(xml, {
      explicitArray: false,
      trim: true,
    });
  } catch {
    /**
     * INVALID XML
     * - HTML 응답
     * - 깨진 RSS
     */
    throw new Error("INVALID_FEED_XML");
  }

  /**
   * RSS 2.0 구조
   */
  if ("rss" in parsed && parsed.rss?.channel?.item) {
    return normalizeRss(parsed.rss.channel.item);
  }

  /**
   * Atom 구조
   */
  if ("feed" in parsed && parsed.feed?.entry) {
    return normalizeAtom(parsed.feed.entry);
  }

  /**
   * Unknown structure
   */
  throw new Error("UNSUPPORTED_FEED_FORMAT");
}

/**
 * RSS 2.0 → FeedItem 변환
 */
function normalizeRss(items: RawRssItem | RawRssItem[]): FeedItem[] {
  const list = Array.isArray(items) ? items : [items];

  return list.map((item) => ({
    title: safeText(item.title),
    link: safeText(item.link),
    publishedAt: parseDate(item.pubDate || item.published || item.date),
  }));
}

/**
 * Atom → FeedItem 변환
 */
function normalizeAtom(entries: RawAtomEntry | RawAtomEntry[]): FeedItem[] {
  const list = Array.isArray(entries) ? entries : [entries];

  return list.map((entry) => ({
    title: safeText(entry.title),

    /**
     * Atom은 link 구조가 복잡할 수 있음
     * <link href="..." />
     */
    link: extractAtomLink(entry.link),

    publishedAt: parseDate(entry.updated || entry.published || entry.date),
  }));
}

/**
 * Atom link 처리
 */
function extractAtomLink(link: RawAtomEntry["link"]): string {
  if (!link) return "";

  if (typeof link === "string") return link;

  if (Array.isArray(link)) {
    const first = link[0];
    if (typeof first === "string") return first;
    return first?.$?.href || "";
  }

  return link?.$?.href || "";
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
