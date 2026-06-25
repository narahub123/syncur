import { JSDOM } from "jsdom";
import {
  CONTENT_SELECTORS,
  DYNAMIC_TEXT_LENGTH,
  SCRIPT_HEAVY_COUNT,
  SPA_ROOT_IDS,
  STATIC_TEXT_LENGTH,
} from "./constants";
import { HtmlSiteDetector, HTML_SITE_TYPE, HtmlSiteType } from "./types";

/**
 * HTML 사이트가 정적(SSR)인지 동적(SPA)인지 판별한다.
 *
 * 판별 우선순위
 * 1. 충분한 본문이 존재하면 STATIC
 * 2. SPA Root + 본문 부족이면 DYNAMIC
 * 3. Script 위주 + 본문 부족이면 DYNAMIC
 * 4. 그 외는 STATIC
 */
export const htmlSiteDetector: HtmlSiteDetector = {
  detect(dom: JSDOM): HtmlSiteType {
    const document = dom.window.document;

    const hasContent = !!document.querySelector(CONTENT_SELECTORS.join(","));

    const hasSpaRoot = !!document.querySelector(SPA_ROOT_IDS.join(","));

    const scriptCount = document.querySelectorAll("script").length;

    const text =
      document.querySelector("main")?.textContent ??
      document.querySelector("article")?.textContent ??
      document.body.textContent ??
      "";

    const textLength = text.trim().length;

    /**
     * 1. 의미 있는 본문이 이미 존재한다.
     *
     * Next.js SSR + Hydration도 여기서 STATIC 처리된다.
     */
    if (hasContent && textLength >= STATIC_TEXT_LENGTH) {
      return HTML_SITE_TYPE.STATIC;
    }

    /**
     * 2. SPA Root만 존재하고
     * 본문이 거의 없다.
     */
    if (hasSpaRoot && textLength <= DYNAMIC_TEXT_LENGTH) {
      return HTML_SITE_TYPE.DYNAMIC;
    }

    /**
     * 3. Script 위주이며
     * 본문이 거의 없다.
     */
    if (
      !hasContent &&
      scriptCount >= SCRIPT_HEAVY_COUNT &&
      textLength <= DYNAMIC_TEXT_LENGTH
    ) {
      return HTML_SITE_TYPE.DYNAMIC;
    }

    /**
     * 4. 기본값
     */
    return HTML_SITE_TYPE.STATIC;
  },
};
