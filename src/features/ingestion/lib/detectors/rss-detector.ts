import { FEED_HEADERS } from "@/features/ingestion/constants/feed";
import { SourceDetector, DetectionResult, SOURCE_TYPE } from "./types";
import {
  RSS_CONTENT_TYPES,
  RSS_FALLBACK_PATHS,
  RSS_LINK_SELECTORS,
} from "./constants";
import { normalizeError } from "../../logger/normalizeError";

/**
 * 주어진 Cheerio 객체와 베이스 URL을 사용하여 RSS/Atom/JSON Feed URL을 탐색합니다.
 * 탐색은 두 단계로 진행됩니다:
 * 1. HTML 내의 link 태그를 파싱하여 피드 주소를 직접 추출합니다.
 * 2. 태그가 없을 경우, 표준 피드 경로(Fallback)에 HEAD 요청을 보내 활성 여부를 확인합니다.
 *
 * @param {cheerio.CheerioAPI} dom - 분석할 사이트의 Cheerio 객체
 * @param {string} baseUrl - 절대 경로 변환을 위한 기준 URL
 * @returns {Promise<string | null>} 발견된 피드의 절대 URL을 반환하며, 찾지 못할 경우 null을 반환합니다.
 */
export const rssDetector: SourceDetector = {
  async detect(dom, url, logger): Promise<DetectionResult | null> {
    // HTML의 link 태그를 순회하며 RSS Feed URL이 선언되어 있는지 확인합니다.
    for (const selector of RSS_LINK_SELECTORS) {
      logger.debug("RSS link 탐색", {
        selector,
      });

      const href = dom(selector).attr("href");

      // RSS Feed URL을 발견한 경우 절대 URL로 변환하여 즉시 반환합니다.
      if (href) {
        const rssUrl = new URL(href, url).href;

        logger.info("RSS 발견", {
          selector,
          href,
          rssUrl,
        });

        return {
          type: SOURCE_TYPE.RSS,
          rssUrl,
        };
      }
    }

    // 2. 휴리스틱(Fallback) 단계: 표준 경로 탐색
    for (const path of RSS_FALLBACK_PATHS) {
      logger.info("RSS fallback 탐색 시작", {
        baseUrl: url,
        paths: RSS_FALLBACK_PATHS,
      });
      const candidateUrl = new URL(path, url).href;

      // 표준 RSS 경로를 대상으로 Feed 존재 여부를 탐색합니다.
      logger.debug("RSS 경로 탐색", {
        path,
        candidateUrl,
      });

      try {
        // HEAD 요청으로 해당 경로가 접근 가능한지 우선 확인합니다.
        const headRes = await fetch(candidateUrl, {
          method: "HEAD",
          headers: FEED_HEADERS,
        });

        logger.debug("RSS HEAD 응답", {
          candidateUrl,
          ok: headRes.ok,
          status: headRes.status,
        });

        // 접근이 불가능한 경우 다음 후보 경로를 탐색합니다.
        if (!headRes.ok) continue;

        // 실제 응답을 받아 Content-Type을 확인합니다.
        const getRes = await fetch(candidateUrl, {
          headers: FEED_HEADERS,
        });

        logger.debug("RSS GET 응답", {
          candidateUrl,
          ok: getRes.ok,
        });

        // 응답을 가져오지 못한 경우 다음 후보 경로를 탐색합니다.
        if (!getRes.ok) continue;

        // 응답 헤더에서 Content-Type을 확인합니다.
        const contentType = getRes.headers.get("content-type") ?? "";

        // RSS/Atom/JSON Feed 형식인지 검사합니다.
        const isFeed = RSS_CONTENT_TYPES.some((type) =>
          contentType.includes(type),
        );

        // Feed 형식이 아닌 경우 다음 후보 경로를 탐색합니다.
        if (!isFeed) {
          logger.debug("RSS 아님", {
            candidateUrl,
            contentType,
            expected: RSS_CONTENT_TYPES,
          });

          continue;
        }

        // Feed 형식이 확인된 경우 RSS Feed를 발견한 것으로 판단합니다.
        logger.info("RSS 발견", {
          rssUrl: candidateUrl,
        });

        return {
          type: SOURCE_TYPE.RSS,
          rssUrl: candidateUrl,
        };
      } catch (error) {
        // RSS 탐색 중 네트워크 또는 요청 오류가 발생한 경우 다음 후보를 계속 탐색합니다.
        logger.warn("RSS 요청 실패", {
          candidateUrl,
          error: normalizeError(error),
        });

        continue;
      }
    }

    // HTML과 표준 경로 모두에서 RSS Feed를 찾지 못한 경우 null을 반환합니다.
    return null;
  },
};
