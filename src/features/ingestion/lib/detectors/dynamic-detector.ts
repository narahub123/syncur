import { JSDOM } from "jsdom";
import { CONTENT_SELECTORS, SPA_ROOT_IDS } from "./constants";

/**
 * 주어진 JSDOM 객체를 분석하여 해당 사이트가 동적 사이트(SPA)인지 판별합니다.
 * * 판별 기준:
 * 1. SPA 프레임워크 루트 ID(예: #root, #__next) 존재 여부 (확실한 징후)
 * 2. 주요 콘텐츠 태그(article 등) 부재 + 본문 내용 부족 + 스크립트 밀집도 (확률적 징후)
 * * @param {JSDOM} dom - 분석할 사이트의 JSDOM 객체
 * @returns {boolean} 동적 사이트(SPA)인 경우 true, 그 외 false를 반환합니다.
 */
export function isDynamicSite(dom: JSDOM): boolean {
  const document = dom.window.document;

  // 1. 정적 태그들이 하나도 없는지 확인
  const hasNoStaticTags = !document.querySelector(CONTENT_SELECTORS.join(","));

  // 2. SPA 고유의 루트 ID 존재 여부
  const hasSpaRoot = !!document.querySelector(SPA_ROOT_IDS.join(","));

  // 3. 스크립트 개수 (10개 이상이면 SPA 가능성 높음)
  const scriptCount = document.querySelectorAll("script").length;
  const isScriptHeavy = scriptCount > 10;

  // 4. 본문 텍스트가 거의 없는지 확인 (초기 HTML의 공허함)
  const bodyText = document.body.textContent || "";
  const isTooShort = bodyText.length < 50;

  // [판단 로직]
  // 1. SPA 루트가 있다면 확실한 동적 사이트
  if (hasSpaRoot) return true;

  // 2. 정적 태그가 없으면서, 본문이 비어있고 스크립트가 많다면 동적 사이트로 간주
  if (hasNoStaticTags && isScriptHeavy && isTooShort) return true;

  return false;
}
