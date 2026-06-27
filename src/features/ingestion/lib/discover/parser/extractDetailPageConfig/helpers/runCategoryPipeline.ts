import * as cheerio from "cheerio";
import { FieldExtractor } from "../../../types";

/**
 * 카테고리/태그 정보를 탐색하는 pipeline
 *
 * 우선순위:
 * 1. meta keywords
 * 2. article:tag
 * 3. class 기반 category/tag/label
 *
 * @param $ - cheerio DOM 인스턴스
 * @returns FieldExtractor | null (카테고리/태그 정보를 찾지 못하면 null)
 */
export function runCategoryPipeline(
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // =====================
  // 1단계: meta keywords 탐색
  // =====================
  const keywords = $("meta[name='keywords']").first();

  // meta keywords가 존재하면 즉시 반환
  if (keywords.length > 0) {
    return {
      selector: "meta[name='keywords']",
      extract: "attr",
      attr: "content",
    };
  }

  // =====================
  // 2단계: article:tag 탐색
  // =====================
  const articleTag = $("meta[property='article:tag']").first();

  // article:tag 메타가 존재하면 반환
  if (articleTag.length > 0) {
    return {
      selector: "meta[property='article:tag']",
      extract: "attr",
      attr: "content",
    };
  }

  // =====================
  // 3단계: class 기반 탐색
  // =====================
  const selectors = [
    "[class*='category']",
    "[class*='tag']",
    "[class*='label']",
    "[rel='category']",
  ];

  // semantic class 기반 요소 탐색
  for (const sel of selectors) {
    const el = $(sel).first();

    // 해당 selector가 존재하면 text 기반 추출
    if (el.length > 0) {
      return {
        selector: sel,
        extract: "text",
      };
    }
  }

  // 모든 단계 실패 시 null 반환
  return null;
}
