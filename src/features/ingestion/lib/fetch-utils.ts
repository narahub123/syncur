import { JSDOM } from "jsdom";
import { FEED_HEADERS } from "@/features/ingestion/constants/feed";

export interface FetchSiteResult {
  finalUrl: string;
  html: string;
  dom: JSDOM;
}

/**
 * 주어진 URL의 HTML을 가져와 사이트 분석에 필요한 데이터를 생성합니다.
 *
 * @param {string} url - 분석할 사이트의 대상 URL
 * @returns {Promise<FetchSiteResult | null>}
 * 성공 시 최종 URL, HTML, JSDOM을 포함한 객체를 반환하며,
 * 연결 실패나 오류 발생 시 null을 반환합니다.
 */
export async function fetchSite(url: string): Promise<FetchSiteResult | null> {
  try {
    const response = await fetch(url, {
      headers: FEED_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return { dom: new JSDOM(html), html, finalUrl: response.url };
  } catch (error) {
    console.error("DOM Fetch Error:", error);
    return null;
  }
}
