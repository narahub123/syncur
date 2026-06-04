import { fetchFeed } from "../fetcher/fetchFeed";

/**
 * CMS/일반 사이트에서 RSS를 추측해서 탐색하는 단계
 *
 * 특징:
 * - 병렬 요청 (performance 중요)
 * - 실패는 정상 (404 / timeout 매우 흔함)
 * - 성공한 것만 반환
 */
export async function probeCommonFeeds(baseUrl: string): Promise<string[]> {
  const candidates = buildCandidates(baseUrl);

  /**
   * 병렬 probing
   * - RSS discovery에서 가장 비용 큰 구간
   */
  const results = await Promise.all(
    candidates.map(async (url) => {
      try {
        const isValid = await fetchFeed(url);
        return isValid ? url : null;
      } catch {
        /**
         * Candidate failure
         * - 404
         * - timeout
         * - invalid xml
         */
        return null;
      }
    }),
  );

  /**
   * 유효한 feed만 반환
   */
  return results.filter(Boolean) as string[];
}

/**
 * RSS 후보 URL 생성
 *
 * CMS 기반 표준 경로 + 일반 패턴
 */
function buildCandidates(baseUrl: string): string[] {
  const url = new URL(baseUrl);

  const origin = url.origin;

  return [
    `${origin}/feed`,
    `${origin}/rss`,
    `${origin}/rss.xml`,
    `${origin}/feed.xml`,
    `${origin}/atom.xml`,
    `${origin}/index.xml`,
  ];
}
