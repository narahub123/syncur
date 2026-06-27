import * as cheerio from "cheerio";
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
  detect(dom, logger): HtmlSiteType {
    const $ = dom;

    // script, style 태그 내용 제거 후 텍스트 추출
    $("script, style, noscript").remove();

    const hasContent = $(CONTENT_SELECTORS.join(",")).length > 0;

    const hasSpaRoot = $(SPA_ROOT_IDS.join(",")).length > 0;

    const scriptCount = $("script").length;

    const text =
      $("main").text() || $("article").text() || $("body").text() || "";

    const textLength = text.trim().length;

    logger.debug("HTML 판별 시작", {
      hasContent,
      hasSpaRoot,
      scriptCount,
      textLength,
      spaRootFound: SPA_ROOT_IDS.filter((id) => $(id).length > 0), // 어떤 id가 매칭됐는지
      bodyLength: $("body").html()?.length, // body HTML 길이
      rootText: $("#root").text().trim().slice(0, 200), // #root 안 텍스트
    });
    /**
     * 1. 의미 있는 본문이 이미 존재한다.
     *
     * Next.js SSR + Hydration도 여기서 STATIC 처리된다.
     */
    if (hasContent && textLength >= STATIC_TEXT_LENGTH) {
      logger.info("STATIC 판정", {
        reason: "content + 충분한 텍스트",
      });
      return HTML_SITE_TYPE.STATIC;
    }

    /**
     * 2. SPA Root만 존재하고
     * 본문이 거의 없다.
     */
    if (hasSpaRoot && textLength <= DYNAMIC_TEXT_LENGTH) {
      logger.info("DYNAMIC 판정", {
        reason: "SPA root + 부족한 텍스트",
      });
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
      logger.info("DYNAMIC 판정", {
        reason: "script-heavy + low text",
      });
      return HTML_SITE_TYPE.DYNAMIC;
    }

    /**
     * 4. 기본값
     */
    logger.debug("STATIC fallback 판정", {
      reason: "기본 규칙",
    });
    return HTML_SITE_TYPE.STATIC;
  },
};
