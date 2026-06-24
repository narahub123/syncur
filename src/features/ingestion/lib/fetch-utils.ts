import { JSDOM } from "jsdom";
import { FEED_HEADERS } from "@/features/ingestion/constants/feed";

/**
 * 주어진 URL의 HTML을 가져와 JSDOM 객체로 변환합니다.
 * * @param {string} url - 분석할 사이트의 대상 URL
 * @returns {Promise<JSDOM | null>} 성공 시 JSDOM 객체를 반환하며,
 * 연결 실패나 에러 발생 시 null을 반환합니다.
 */
export async function fetchSiteDom(url: string): Promise<JSDOM | null> {
  try {
    const response = await fetch(url, {
      headers: FEED_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    return new JSDOM(html);
  } catch (error) {
    console.error("DOM Fetch Error:", error);
    return null;
  }
}
