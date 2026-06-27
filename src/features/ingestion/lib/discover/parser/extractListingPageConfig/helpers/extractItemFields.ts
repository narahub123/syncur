import * as cheerio from "cheerio";
import { AnyNode } from "domhandler";
import { getSelector } from "./getSelector";
import { FieldExtractor } from "../../../types";

/**
 * 목록 아이템에서 핵심 필드 (link / title / publishedAt)를 추출합니다.
 *
 * - 링크: 동일 도메인 상세 페이지
 * - 제목: 가장 긴 anchor 텍스트
 * - publishedAt: datetime attribute 또는 날짜 패턴
 *
 * @param item 분석 대상 아이템 노드
 * @param baseUrl 기준 URL
 * @param dom Cheerio DOM
 */
export function extractItemFields(
  item: AnyNode,
  baseUrl: string,
  dom: cheerio.CheerioAPI,
): {
  link: FieldExtractor | null;
  title: FieldExtractor | null;
  publishedAt: FieldExtractor | null;
} {
  const $ = dom;
  const origin = new URL(baseUrl).origin;

  let link: FieldExtractor | null = null;
  let title: FieldExtractor | null = null;
  let publishedAt: FieldExtractor | null = null;

  // ── 1. 링크 후보 수집 ─────────────────────────────
  const links = $(item)
    .find("a[href]")
    .toArray()
    .filter((a) => {
      const href = $(a).attr("href") ?? "";
      try {
        const resolved = new URL(href, baseUrl).toString();
        return resolved.startsWith(origin) && resolved !== baseUrl;
      } catch {
        return false;
      }
    });

  if (links.length === 0) {
    return { link: null, title: null, publishedAt: null };
  }

  // ── 2. title / link 선택 ───────────────────────────
  const titleLink = links.reduce((best, cur) => {
    return $(cur).text().trim().length > $(best).text().trim().length
      ? cur
      : best;
  });

  const selector = getSelector(titleLink, $);

  link = {
    selector,
    extract: "attr",
    attr: "href",
  };

  title = {
    selector,
    extract: "text",
  };

  // ── 3. publishedAt 탐색 ─────────────────────────────
  const DATE_ATTRS = ["datetime", "data-date", "data-time", "data-published"];

  const DATE_PATTERN = /\d{4}[-./]\d{1,2}[-./]\d{1,2}/;

  // 3-1. attribute 기반
  for (const attr of DATE_ATTRS) {
    const el = $(item).find(`[${attr}]`).first();
    if (el.length > 0) {
      publishedAt = {
        selector: getSelector(el[0], $),
        extract: "attr",
        attr,
      };
      break;
    }
  }

  // 3-2. 텍스트 기반 fallback
  if (!publishedAt) {
    $(item)
      .find("*")
      .each((_, el) => {
        const text = $(el).text().trim();
        if (DATE_PATTERN.test(text) && $(el).children().length === 0) {
          publishedAt = {
            selector: getSelector(el, $),
            extract: "text",
          };
          return false;
        }
      });
  }

  return { link, title, publishedAt };
}
