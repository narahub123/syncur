import * as cheerio from "cheerio";
import { FieldExtractor } from "../../../types";

/**
 * 작성자 정보를 탐색하는 pipeline
 *
 * 우선순위:
 * 1. meta[name="author"]
 * 2. class 기반 author/writer/rel
 *
 * @param $ - cheerio DOM 인스턴스
 * @returns FieldExtractor | null (작성자 정보를 추출할 수 없으면 null)
 */
export function runAuthorPipeline(
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // =====================
  // 1단계: meta author 탐색
  // =====================
  const meta = $("meta[name='author']").first();

  // meta 태그 기반 author 정보가 존재하는 경우 즉시 반환
  if (meta.length > 0) {
    return {
      selector: "meta[name='author']",
      extract: "attr",
      attr: "content",
    };
  }

  // =====================
  // 2단계: semantic selector 기반 탐색
  // =====================
  const selectors = [
    "[class*='author']",
    "[class*='writer']",
    "[rel='author']",
    ".by",
  ];

  // 각 selector를 순회하며 author 정보를 탐색
  for (const sel of selectors) {
    const el = $(sel).first();

    // 해당 selector에 매칭되는 요소가 존재하면 첫 번째 결과를 반환
    if (el.length > 0) {
      return {
        selector: sel,
        extract: "text",
      };
    }
  }

  // 모든 탐색 실패 시 null 반환
  return null;
}
