"use server";

import { normalizeUrl } from "@/features/ingestion/utils/url";
import { fetchSiteDom } from "../lib/fetch-utils";
import { isStaticSite } from "../lib/detectors/static-detector";
import { isDynamicSite } from "../lib/detectors/dynamic-detector";
import { parseRss } from "../lib/parsers/rss-parser";
import { rssDetector } from "../lib/detectors/rss-detector";
import { SOURCE_TYPE } from "../lib/detectors/types";
import { SitemapDetector } from "../lib/detectors/sitemap-detector";

/**
 * 피드 탐색 결과 인터페이스
 */
export interface DiscoveryResult {
  success: boolean;
  url: string;
  feedUrl: string | null;
  message?: string;
}

/**
 * 주어진 사이트 URL에서 RSS, Atom, JSON Feed를 탐색합니다.
 * HTML 내 링크 태그를 우선 확인하고, 실패 시 휴리스틱(표준 경로)을 시도합니다.
 * * @param {string} input - 사용자가 입력한 사이트 도메인 또는 URL
 * @returns {Promise<DiscoveryResult>} 탐색 성공 여부와 피드 URL 정보를 포함한 객체
 */
export async function discoverFeedAction(
  input: string,
): Promise<DiscoveryResult> {
  try {
    const targetUrl = normalizeUrl(input);

    // 1. 공통: DOM 가져오기
    const dom = await fetchSiteDom(targetUrl);

    if (!dom) {
      return {
        success: false,
        url: targetUrl,
        feedUrl: null,
        message: "사이트에 연결할 수 없습니다.",
      };
    }

    // 2. RSS 판별 (있으면 종료)
    const result = await rssDetector.detect(dom, targetUrl);
    console.log(result);

    if (result?.type === SOURCE_TYPE.RSS) {
      const res = await parseRss(result.rssUrl);

      return {
        success: true,
        url: targetUrl,
        feedUrl: result.rssUrl,
        message: "RSS 피드를 찾았습니다.",
      };
    }

    // 3. sitemap 찾기
    // 1. 인스턴스 생성
    const sitemapDetector = new SitemapDetector();

    // 2. 메서드 호출 (해당 사이트의 URL 입력)
    const sitemapEntries = await sitemapDetector.detect("https://example.com");

    // 3. 결과 확인
    if (sitemapEntries.length > 0) {
      console.log(`성공! ${sitemapEntries.length}개의 URL을 찾았습니다.`);
      console.log(sitemapEntries.slice(0, 5)); // 상위 5개만 출력해보기
    } else {
      console.log("사이트맵을 찾지 못했거나 글이 없습니다.");
    }
    // 3. 정적(SSR) 판별
    if (isStaticSite(dom)) {
      return {
        success: true,
        url: targetUrl,
        feedUrl: null,
        message: "정적(SSR) 사이트입니다.",
      };
    }

    // 4. 동적(SPA) 판별
    if (isDynamicSite(dom)) {
      return {
        success: true,
        url: targetUrl,
        feedUrl: null,
        message: "동적(SPA) 사이트입니다.",
      };
    }

    // 5. 판별 불가
    return {
      success: true,
      url: targetUrl,
      feedUrl: null,
      message: "알 수 없는 사이트 형식입니다.",
    };
  } catch (error) {
    console.error("Feed discovery error:", error);
    return {
      success: false,
      url: input,
      feedUrl: null,
      message: "분석 중 오류가 발생했습니다.",
    };
  }
}
