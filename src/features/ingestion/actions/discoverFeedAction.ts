"use server";

import { normalizeUrl } from "@/features/ingestion/utils/url";
import { JSDOM } from "jsdom";
import { FEED_HEADERS } from "@/features/ingestion/constants/feed";

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

    // 1. 메인 페이지 HTML 가져오기
    const response = await fetch(targetUrl, {
      headers: FEED_HEADERS,
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`사이트 연결 실패: ${response.statusText}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // 2. [탐색 단계] HTML 내 link 태그 우선 탐색
    // RSS, Atom, JSON Feed 규격을 모두 확인합니다.
    const rssLink =
      doc
        .querySelector('link[type="application/rss+xml"]')
        ?.getAttribute("href") ||
      doc
        .querySelector('link[type="application/atom+xml"]')
        ?.getAttribute("href") ||
      doc
        .querySelector('link[type="application/feed+json"]')
        ?.getAttribute("href");

    if (rssLink) {
      return {
        success: true,
        url: targetUrl,
        feedUrl: new URL(rssLink, targetUrl).href,
      };
    }

    // 3. [휴리스틱 단계] 태그가 없을 경우, 표준 피드 경로 시도 (Fallback)
    const fallbackPaths = ["/rss", "/feed", "/atom.xml", "/feed.json"];

    for (const path of fallbackPaths) {
      const candidateUrl = new URL(path, targetUrl).href;
      const headRes = await fetch(candidateUrl, {
        method: "HEAD",
        headers: FEED_HEADERS,
      });

      if (headRes.ok) {
        return { success: true, url: targetUrl, feedUrl: candidateUrl };
      }
    }

    return {
      success: true,
      url: targetUrl,
      feedUrl: null,
      message: "피드를 찾을 수 없습니다.",
    };
  } catch (error) {
    console.error("Feed discovery error:", error);
    return {
      success: false,
      url: input,
      feedUrl: null,
      message:
        "해당 사이트에서 피드를 찾을 수 없거나 연결이 원활하지 않습니다. 주소를 다시 확인해주세요.",
    };
  }
}
