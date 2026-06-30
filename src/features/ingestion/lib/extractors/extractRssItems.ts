import { FeedItemInput } from "@/features/feed-sample/types";
import { Logger } from "pino";

type RssParserFeed = {
  items: Array<{
    link?: string;
    title?: string;
    content?: string;
    contentSnippet?: string;
    description?: string;
    creator?: string;
    author?: string;
    pubDate?: string;
    isoDate?: string;
    categories?: string[];
  }>;
};

/**
 * RSS Parser 결과 → FeedItemInput[] 변환
 *
 * @description
 * rss-parser 라이브러리 결과는 필드 구조가 일관되지 않기 때문에
 * 시스템 내부에서 사용하는 FeedItemInput 형태로 정규화하는 역할을 한다.
 *
 * - RSS item → crawler/dynamic과 동일한 feed 구조로 통일
 * - description/content 계열 필드 fallback 처리
 * - publishedAt은 문자열 그대로 유지 (후속 단계에서 Date 변환 가능)
 */
export function extractRssItems(
  feed: RssParserFeed,
  limit: number = 5,
  logger: Logger,
): FeedItemInput[] {
  // =========================
  // [0. 유효성 검사]
  // =========================
  if (!feed?.items?.length) {
    logger?.debug({ limit }, "rss.extract.empty");
    return [];
  }

  const outputCount = Math.min(feed.items.length, limit);

  logger?.debug(
    {
      input: feed.items.length,
      output: outputCount,
    },
    "rss.extract.start",
  );

  const result = feed.items.slice(0, limit).map((item) => ({
    // =========================
    // [1. 기본 링크 / 제목]
    // =========================
    link: item.link ?? "",
    title: item.title ?? "",

    // =========================
    // [2. 설명 필드 fallback]
    // =========================
    // RSS마다 content / contentSnippet / description 중
    // 존재하는 필드가 다르기 때문에 우선순위 기반 선택
    description:
      item.content ?? item.contentSnippet ?? item.description ?? undefined,

    // =========================
    // [3. 작성자 정보 fallback]
    // =========================
    author: item.creator ?? item.author ?? undefined,

    // =========================
    // [4. 발행일 (raw string 유지)]
    // =========================
    // isoDate / pubDate 둘 다 문자열 → 이후 단계에서 Date 변환 가능
    publishedAt: item.isoDate ?? item.pubDate ?? undefined,

    // =========================
    // [5. 카테고리 정규화]
    // =========================
    categories: item.categories ?? [],
  }));

  logger?.debug(
    {
      output: result.length,
    },
    "rss.extract.success",
  );

  return result;
}
