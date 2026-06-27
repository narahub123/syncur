import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { AUTHOR_SELECTORS } from "../../constants";

/**
 * 목록 항목의 작성자 정보를 분석합니다.
 *
 * 작성자 정보가 반복적으로 나타나는지 확인하여
 * 목록 페이지의 신뢰도를 판단합니다.
 *
 * @param {cheerio.Cheerio<AnyNode>} listItems - 반복 구조에서 추출한 목록 항목
 * @returns {number} 작성자 정보가 확인된 항목 수를 반환합니다.
 */
export function analyzeAuthors(
  dom: cheerio.CheerioAPI,
  listItems: cheerio.Cheerio<AnyNode>,
): number {
  let authorHitCount = 0;

  // 작성자 선택자를 순회하며 반복 여부를 확인합니다.
  for (const selector of AUTHOR_SELECTORS) {
    listItems.each((_, el) => {
      if (dom(el).find(selector).length > 0) {
        authorHitCount++;
      }
    });

    // 충분한 수의 작성자가 확인되면 추가 탐색을 종료합니다.
    if (authorHitCount >= 3) {
      break;
    }
  }

  return authorHitCount;
}
