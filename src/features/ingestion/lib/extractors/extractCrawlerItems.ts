import * as cheerio from "cheerio";
import { ListingPageConfig, FieldExtractor } from "../discover/types";
import { FeedItemInput } from "@/features/feed-sample/types";

/**
 * HTML (Cheerio DOM) → FeedItemInput[] 변환
 *
 * @param html - 크롤링 대상 HTML 문자열
 * @param config - 목록 페이지 구조 정의 (selector + field extractor)
 * @param baseUrl - 상대 링크를 절대 경로로 변환하기 위한 기준 URL
 * @param limit - 최대 추출 개수 (default: 5)
 *
 * @returns FeedItemInput[]
 *  - link: 절대 URL
 *  - title: 게시글 제목
 *  - publishedAt: 선택적 날짜 정보 (raw string)
 *  - categories: 기본 빈 배열
 *
 * @description
 * 목록 페이지에서 DOM 구조를 기반으로 FeedItemInput을 생성하는 핵심 extractor.
 * RSS와 동일한 FeedItemInput 구조로 맞추기 위한 crawler 단계 변환기이다.
 */
export function extractCrawlerItems(
  html: string,
  config: ListingPageConfig,
  baseUrl: string,
  limit: number = 5,
): FeedItemInput[] {
  const $ = cheerio.load(html);
  const items: FeedItemInput[] = [];

  // =========================
  // [1. 대상 DOM 선택]
  // =========================
  const elements = $(config.itemSelector);

  elements.each((_, el) => {
    // =========================
    // [2. limit 제한]
    // =========================
    if (items.length >= limit) return;

    // =========================
    // [3. field extractor 실행기]
    // =========================
    const resolveField = (field: FieldExtractor) => {
      const target = $(el).find(field.selector);
      if (!target.length) return undefined;

      if (field.extract === "text") {
        return target.text()?.trim();
      }

      if (field.extract === "attr") {
        if (!field.attr) return undefined;
        return target.attr(field.attr);
      }

      return undefined;
    };

    // =========================
    // [4. link 추출 + 절대경로 변환]
    // =========================
    const linkRaw = resolveField(config.fields.link);
    const link = linkRaw ? new URL(linkRaw, baseUrl).href : undefined;

    // =========================
    // [5. title 추출]
    // =========================
    const title = resolveField(config.fields.title);

    // =========================
    // [6. publishedAt (raw)]
    // =========================
    const publishedAt = config.fields.publishedAt
      ? resolveField(config.fields.publishedAt)
      : undefined;

    // =========================
    // [7. validation]
    // =========================
    if (!link || !title) return;

    // =========================
    // [8. FeedItem 생성]
    // =========================
    items.push({
      link,
      title,
      publishedAt,
      categories: [],
    });
  });

  return items;
}
