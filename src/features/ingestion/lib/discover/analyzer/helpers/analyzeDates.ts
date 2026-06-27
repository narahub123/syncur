import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { DateAnalysisResult } from "./types";
import { DATE_PATTERN } from "../../constants";

/**
 * 목록 항목의 날짜 정보를 분석합니다.
 *
 * 날짜의 다양성을 확인하여 목록 페이지의 신뢰도를 판단하고,
 * 가장 최신 날짜를 함께 추출합니다.
 *
 * @param {cheerio.Cheerio<AnyNode>} listItems - 반복 구조에서 추출한 목록 항목
 * @returns {DateAnalysisResult} 날짜 분석 결과를 반환합니다.
 */
export function analyzeDates(
  dom: cheerio.CheerioAPI,
  listItems: cheerio.Cheerio<AnyNode>,
): DateAnalysisResult {
  const datesPerItem: string[] = [];

  // 각 목록 항목에서 날짜를 추출합니다.
  listItems.each((_, el) => {
    const matches = dom(el).text().match(DATE_PATTERN);

    if (matches) {
      datesPerItem.push(matches[0]);
    }
  });

  // 날짜가 충분하지 않으면 분석하지 않습니다.
  if (datesPerItem.length < 3) {
    return {
      hasVariousDates: false,
      uniqueDateCount: 0,
      lastUpdated: null,
    };
  }

  // 날짜 종류를 계산합니다.
  const uniqueDates = new Set(datesPerItem);

  if (uniqueDates.size < 2) {
    return {
      hasVariousDates: false,
      uniqueDateCount: 1,
      lastUpdated: null,
    };
  }

  // 가장 최신 날짜를 추출합니다.
  const lastUpdated =
    datesPerItem
      .map((date) => date.replace(/[./]/g, "-"))
      .sort()
      .at(-1) ?? null;

  return {
    hasVariousDates: true,
    uniqueDateCount: uniqueDates.size,
    lastUpdated,
  };
}
