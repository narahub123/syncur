import * as cheerio from "cheerio";
import { NOISE_REMOVE_SELECTORS } from "./constants";

/**
 * 분석에 불필요한 노이즈 영역을 DOM에서 제거합니다.
 *
 * 내비게이션, 광고, 쿠키 배너 등의 요소를 제거하여
 * 이후 반복 구조 탐지의 정확도를 높입니다.
 *
 * @param {cheerio.CheerioAPI} dom - 분석할 페이지의 Cheerio 객체
 */
export function removeNoiseElements(dom: cheerio.CheerioAPI): void {
  // 반복 구조 탐지를 방해하는 노이즈 영역을 제거합니다.
  NOISE_REMOVE_SELECTORS.forEach((selector) => {
    dom(selector).remove();
  });
}
