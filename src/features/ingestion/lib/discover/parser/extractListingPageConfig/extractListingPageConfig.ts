import * as cheerio from "cheerio";

import { findListingContainer } from "./helpers/findListingContainer";
import { buildItemSelector } from "./helpers/buildItemSelector";
import { extractItemFields } from "./helpers/extractItemFields";
import { detectPagination } from "./helpers/detectPagination";
import { Logger } from "@/features/ingestion/logger/types";
import { ListingPageConfig } from "../../types";

/**
 * 목록 페이지 DOM을 분석해 ParserConfig를 추출합니다.
 *
 * - container 탐색
 * - item selector 생성
 * - field extractor 생성
 * - pagination 탐지
 * - firstItemUrl 추출
 *
 * @param url 목록 페이지 URL
 * @param dom Cheerio DOM
 * @param logger ingestion logger
 */
export function extractListingPageConfig(
  url: string,
  dom: cheerio.CheerioAPI,
  logger: Logger,
): (ListingPageConfig & { firstItemUrl: string | null }) | null {
  // ── 1. 컨테이너 탐색 ─────────────────────────────
  const container = findListingContainer(url, dom);

  if (!container) {
    logger.debug("컨테이너 없음");
    return null;
  }

  logger.debug("컨테이너 선택 완료");

  // ── 2. item selector 생성 ─────────────────────────
  const itemSelector = buildItemSelector(container, dom);

  if (!itemSelector) {
    logger.debug("아이템 셀렉터 없음");
    return null;
  }

  logger.debug("아이템 셀렉터 생성 완료");

  // ── 3. 대표 item 추출 ─────────────────────────────
  const $ = dom;

  const tag = itemSelector.split(" > ")[1];
  const firstItem = $(container).children(tag).first()[0];

  if (!firstItem) {
    logger.debug("대표 아이템 없음");
    return null;
  }

  logger.debug("대표 아이템 선택 완료");

  // ── 4. 필드 추출 ──────────────────────────────────
  const fields = extractItemFields(firstItem, url, dom);

  if (!fields.link || !fields.title) {
    logger.debug("필드 추출 실패");
    return null;
  }

  logger.debug("필드 추출 완료", {
    hasPublishedAt: !!fields.publishedAt,
  });

  // ── 5. pagination 탐지 ─────────────────────────────
  const pagination = detectPagination(dom);

  logger.debug("페이지네이션 탐지", {
    found: pagination.hasPagination,
  });

  // ── 6. firstItemUrl 생성 ──────────────────────────
  const href = $(firstItem).find("a[href]").first().attr("href") ?? null;

  let firstItemUrl: string | null = null;

  if (href) {
    try {
      firstItemUrl = new URL(href, url).toString();
    } catch {
      firstItemUrl = null;
    }
  }

  logger.debug("대표 URL 추출", {
    found: !!firstItemUrl,
  });

  // ── 7. 최종 config 조립 ───────────────────────────
  logger.info("목록 설정 생성");

  return {
    itemSelector,
    fields: {
      title: fields.title,
      link: fields.link,
      publishedAt: fields.publishedAt,
    },
    pagination: {
      nextPageSelector: pagination.nextPageSelector,
    },
    firstItemUrl,
  };
}
