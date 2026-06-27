import * as cheerio from "cheerio";
import { FieldExtractor } from "../../../types";
import { DATE_ATTRS, DATE_PATTERN } from "./constants";
import { getSelector } from "./getSelector";

/**
 * publishedAt 필드를 추출하기 위한 3단계 파이프라인입니다.
 *
 * 실행 순서:
 * 1. datetime / data-* attribute 기반 추출
 * 2. meta 태그 기반 추출
 * 3. 텍스트 스캔 fallback
 *
 * @param $ - cheerio DOM
 * @returns FieldExtractor | null
 */
export function runPublishedAtPipeline(
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // =====================
  // 1단계: attribute 기반 추출
  // =====================
  for (const attr of DATE_ATTRS) {
    const el = $(`[${attr}]`).first();
    if (el.length > 0) {
      return {
        selector: getSelector(el[0], $),
        extract: "attr",
        attr,
      };
    }
  }

  // =====================
  // 2단계: meta 기반 추출
  // =====================
  const metaSelectors = [
    "meta[property='article:published_time']",
    "meta[name='pubdate']",
    "meta[name='date']",
  ];

  for (const sel of metaSelectors) {
    const el = $(sel).first();
    if (el.length > 0) {
      return {
        selector: sel,
        extract: "attr",
        attr: "content",
      };
    }
  }

  // =====================
  // 3단계: text scan fallback (핵심 단계)
  // =====================
  let found: FieldExtractor | null = null;

  $("*").each((_, el) => {
    if (found) return;

    const text = $(el).text().trim();

    // 날짜 패턴 + leaf node 조건으로 최소 노이즈만 허용
    if (DATE_PATTERN.test(text) && $(el).children().length === 0) {
      found = {
        selector: getSelector(el, $),
        extract: "text",
      };
    }
  });

  return found;
}
