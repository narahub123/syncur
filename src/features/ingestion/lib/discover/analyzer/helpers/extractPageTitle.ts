import * as cheerio from "cheerio";

/**
 * 페이지의 대표 제목을 추출합니다.
 *
 * title 태그를 우선 사용하며,
 * 없을 경우 h1 태그를 대체하여 사용합니다.
 *
 * @param {cheerio.CheerioAPI} dom - 분석할 페이지의 Cheerio 객체
 * @returns {string | null} 추출된 페이지 제목을 반환하며, 찾지 못한 경우 null을 반환합니다.
 */
export function extractPageTitle(dom: cheerio.CheerioAPI): string | null {
  // title 태그를 우선적으로 사용합니다.
  const title = dom("title").first().text().trim();

  if (title) {
    return title;
  }

  // title이 없으면 첫 번째 h1 태그를 사용합니다.
  const h1 = dom("h1").first().text().trim();

  return h1 || null;
}
