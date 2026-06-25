import { FEED_HEADERS } from "@/features/ingestion/constants/feed";
import { SourceDetector, DetectionResult, SOURCE_TYPE } from "./types";
import {
  RSS_CONTENT_TYPES,
  RSS_FALLBACK_PATHS,
  RSS_LINK_SELECTORS,
} from "./constants";

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
  async detect(dom, url): Promise<DetectionResult | null> {
    for (const selector of RSS_LINK_SELECTORS) {
      const href = dom(selector).attr("href");

      if (href) {
        return {
          type: SOURCE_TYPE.RSS,
          rssUrl: new URL(href, url).href,
        };
      }
    }

    // 2. 휴리스틱(Fallback) 단계: 표준 경로 탐색
    for (const path of RSS_FALLBACK_PATHS) {
      const candidateUrl = new URL(path, url).href;

      try {
        const headRes = await fetch(candidateUrl, {
          method: "HEAD",
          headers: FEED_HEADERS,
        });

        if (!headRes.ok) continue;

        const getRes = await fetch(candidateUrl, {
          headers: FEED_HEADERS,
        });

        if (!getRes.ok) continue;

        const contentType = getRes.headers.get("content-type") ?? "";

        const isFeed = RSS_CONTENT_TYPES.some((type) =>
          contentType.includes(type),
        );

        if (!isFeed) continue;

        return {
          type: SOURCE_TYPE.RSS,
          rssUrl: candidateUrl,
        };
      } catch {
        continue;
      }
    }

    return null;
  },
};
