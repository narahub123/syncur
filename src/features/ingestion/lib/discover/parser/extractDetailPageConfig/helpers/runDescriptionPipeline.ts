import * as cheerio from "cheerio";
import { FieldExtractor } from "../../../types";

/**
 * 본문 설명(description) 추출 pipeline
 *
 * 우선순위:
 * 1. og:description
 * 2. meta description
 * 3. 본문 첫 paragraph fallback
 *
 * @param $ - cheerio DOM 인스턴스
 * @returns FieldExtractor | null (description을 찾지 못하면 null)
 */
export function runDescriptionPipeline(
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // =====================
  // 1단계: og:description
  // =====================
  const og = $("meta[property='og:description']").first();

  // og description 메타가 존재하면 즉시 반환
  if (og.length > 0) {
    return {
      selector: "meta[property='og:description']",
      extract: "attr",
      attr: "content",
    };
  }

  // =====================
  // 2단계: meta description
  // =====================
  const meta = $("meta[name='description']").first();

  // meta description이 존재하면 반환
  if (meta.length > 0) {
    return {
      selector: "meta[name='description']",
      extract: "attr",
      attr: "content",
    };
  }

  // =====================
  // 3단계: 본문 fallback 탐색
  // =====================
  const contentSelectors = [
    "article p",
    "main p",
    "[class*='content'] p",
    "[class*='body'] p",
  ];

  // 본문 영역에서 첫 번째 paragraph 기반 탐색
  for (const sel of contentSelectors) {
    const el = $(sel).first();

    // fallback paragraph가 존재하면 text 추출
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
