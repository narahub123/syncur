import { JSDOM } from "jsdom";
import { CONTENT_SELECTORS, SPA_ROOT_IDS } from "./constants";

/**
 * 주어진 JSDOM 객체를 분석하여 해당 사이트가 정적 사이트(SSR)인지 판별합니다.
 * * 판별 기준:
 * 1. article, main 등 주요 콘텐츠를 감싸는 의미론적 태그 존재 여부
 * 2. SPA 루트 ID(#root 등)가 없거나, 콘텐츠 태그와 함께 존재할 경우
 * 3. 본문 텍스트가 300자 이상으로 의미 있는 정보 밀도를 가지는지 확인
 * * @param {JSDOM} dom - 분석할 사이트의 JSDOM 객체
 * @returns {boolean} 정적 사이트(SSR)로 판단되면 true, 그 외 false를 반환합니다.
 */
export function isStaticSite(dom: JSDOM): boolean {
  const document = dom.window.document;

  const hasContentTags = !!document.querySelector(CONTENT_SELECTORS.join(","));

  // 정적 사이트라면 <div id="root"> 처럼 자바스크립트가 렌더링할 껍데기가 없어야 함.
  const hasSpaRoot = !!document.querySelector(SPA_ROOT_IDS.join(","));

  if (!hasContentTags && hasSpaRoot) return false;

  // 컨텐츠가 존재한다면 텍스트 길이 확인 (JSDOM의 textContent 사용)
  const textContent = document.body.textContent || "";

  // 1. 컨텐츠 태그가 존재하고
  // 2. 실제 텍스트 길이가 300자 이상(의미 있는 정보가 담김)이면 정적 사이트로 판별
  return hasContentTags && textContent.length > 300;
}
