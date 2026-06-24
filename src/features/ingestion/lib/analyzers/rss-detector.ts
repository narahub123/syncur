import { JSDOM } from "jsdom";
import { FEED_HEADERS } from "@/features/ingestion/constants/feed";

/**
 * 주어진 JSDOM 객체와 베이스 URL을 사용하여 RSS/Atom/JSON Feed URL을 탐색합니다.
 * 탐색은 두 단계로 진행됩니다:
 * 1. HTML 내의 link 태그를 파싱하여 피드 주소를 직접 추출합니다.
 * 2. 태그가 없을 경우, 표준 피드 경로(Fallback)에 HEAD 요청을 보내 활성 여부를 확인합니다.
 * * @param {JSDOM} dom - 분석할 사이트의 JSDOM 객체
 * @param {string} baseUrl - 절대 경로 변환을 위한 기준 URL
 * @returns {Promise<string | null>} 발견된 피드의 절대 URL을 반환하며, 찾지 못할 경우 null을 반환합니다.
 */
export async function checkRss(
  dom: JSDOM,
  baseUrl: string,
): Promise<string | null> {
  const doc = dom.window.document;

  // 1. HTML 내 link 태그 우선 탐색
  const rssSelectors = [
    'link[type="application/rss+xml"]',
    'link[type="application/atom+xml"]',
    'link[type="application/feed+json"]',
  ];

  for (const selector of rssSelectors) {
    const href = doc.querySelector(selector)?.getAttribute("href");
    if (href) {
      return new URL(href, baseUrl).href;
    }
  }

  // 2. 휴리스틱(Fallback) 단계: 표준 경로 탐색
  const fallbackPaths = ["/rss", "/feed", "/atom.xml", "/feed.json"];
  for (const path of fallbackPaths) {
    const candidateUrl = new URL(path, baseUrl).href;
    try {
      const headRes = await fetch(candidateUrl, {
        method: "HEAD",
        headers: FEED_HEADERS,
      });
      if (headRes.ok) return candidateUrl;
    } catch (e) {
      // HEAD 요청 실패 시 무시하고 다음 경로 진행
      continue;
    }
  }

  return null;
}
