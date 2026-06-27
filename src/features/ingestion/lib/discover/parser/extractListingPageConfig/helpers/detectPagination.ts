import * as cheerio from "cheerio";
import { nextSelectors } from "./constants";

/**
 * 페이지네이션 존재 여부를 탐지합니다.
 *
 * - next/prev 링크
 * - page query 파라미터
 * - pagination class 기반 탐지
 *
 * @param dom Cheerio DOM
 * @returns pagination 존재 여부
 */
export function detectPagination(dom: cheerio.CheerioAPI): {
  hasPagination: boolean;
  nextPageSelector: string | null;
} {
  let nextPageSelector: string | null = null;

  // ── 1. 우선순위 기반 selector 탐색 ─────────────────────

  for (const sel of nextSelectors) {
    if (dom(sel).length > 0) {
      nextPageSelector = sel;
      break;
    }
  }

  // ── 2. 존재 여부 판단 ────────────────────────────────
  const hasPagination =
    !!nextPageSelector ||
    dom("[class*='pag']").length > 0 ||
    dom("a[href*='page=']").length > 0 ||
    dom("a[href*='p=']").length > 0 ||
    dom(".next, .prev, [rel='next'], [rel='prev']").length > 0;

  return {
    hasPagination,
    nextPageSelector,
  };
}
