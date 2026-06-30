import * as cheerio from "cheerio";

import { findListingContainer } from "./helpers/findListingContainer";
import { buildItemSelector } from "./helpers/buildItemSelector";
import { extractItemFields } from "./helpers/extractItemFields";
import { detectPagination } from "./helpers/detectPagination";
import { ListingPageConfig } from "../../types";
import { Logger } from "pino";

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
    logger.debug({ url }, "listing.container.not_found");
    return null;
  }

  logger.debug({ url }, "listing.container.found");

  // ── 2. item selector 생성 ─────────────────────────
  const itemSelector = buildItemSelector(container, dom);

  if (!itemSelector) {
    logger.debug({ url }, "listing.item_selector.not_found");
    return null;
  }

  logger.debug({ url, itemSelector }, "listing.item_selector.built");

  // ── 3. 대표 item 추출 ─────────────────────────────
  const $ = dom;

  const tag = itemSelector.split(" > ")[1];
  const firstItem = $(container).children(tag).first()[0];

  if (!firstItem) {
    logger.debug({ url, itemSelector }, "listing.first_item.not_found");
    return null;
  }

  logger.debug({ url }, "listing.first_item.found");

  // ── 4. 필드 추출 ──────────────────────────────────
  const fields = extractItemFields(firstItem, url, dom);

  if (!fields.link || !fields.title) {
    logger.debug(
      { url, hasLink: !!fields.link, hasTitle: !!fields.title },
      "listing.fields.extract.failed",
    );
    return null;
  }

  logger.debug(
    { url, hasPublishedAt: !!fields.publishedAt },
    "listing.fields.extract.success",
  );

  // ── 5. pagination 탐지 ─────────────────────────────
  const pagination = detectPagination(dom);

  logger.debug(
    { url, found: pagination.hasPagination },
    "listing.pagination.detected",
  );

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

  logger.debug(
    { url, found: !!firstItemUrl },
    "listing.first_item_url.extracted",
  );

  // ── 7. 최종 config 조립 ───────────────────────────
  logger.info({ url, itemSelector }, "listing.config.created");

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
