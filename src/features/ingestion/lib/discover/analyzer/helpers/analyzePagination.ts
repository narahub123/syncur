import * as cheerio from "cheerio";

/**
 * 페이지네이션 존재 여부를 분석합니다.
 *
 * 페이지네이션 영역 또는 관련 링크가 존재하는지 확인하여
 * 목록 페이지의 신뢰도를 판단합니다.
 *
 * @param {cheerio.CheerioAPI} dom - 분석할 페이지의 Cheerio 객체
 * @returns {boolean} 페이지네이션 존재 여부를 반환합니다.
 */
export function analyzePagination(dom: cheerio.CheerioAPI): boolean {
  // 페이지네이션 영역 또는 관련 링크의 존재 여부를 확인합니다.
  return (
    dom("[class*='pag']").length > 0 ||
    dom("a[href*='page=']").length > 0 ||
    dom("a[href*='p=']").length > 0 ||
    dom(".next, .prev, [rel='next'], [rel='prev']").length > 0
  );
}
