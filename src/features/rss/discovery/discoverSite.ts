import { fetchHtml } from "../fetcher/fetchHtml";
import { extractRelFeed } from "../strategies/extractRelFeed";
import { probeCommonFeeds } from "../strategies/probeCommonFeeds";
import { detectCmsFeed } from "../strategies/detectCmsFeed";
import { extractMetaFeed } from "../strategies/extractMetaFeed";
import { scoreFeeds } from "../scoring/scoreFeed";
import { parseAndNormalizeFeed } from "../parser/parseFeed";
import { getSiteCache, setSiteCache } from "../cache/siteCache";
import { SiteDiscoveryResult } from "./types";
import { normalizeSiteUrl } from "../../../shared/utils/url";

/**
 * RSS / Atom feed discovery pipeline
 *
 * 핵심 역할:
 * - 사이트 HTML 분석
 * - RSS 후보 수집
 * - validation + scoring
 * - 최종 feed_url 결정
 */
export async function discoverSite(
  inputUrl: string,
): Promise<SiteDiscoveryResult> {
  /**
   * 1. URL 정규화
   * - query / hash 제거된 canonical URL 생성
   * - cache key로 사용됨
   */
  const normalizedUrl = normalizeSiteUrl(inputUrl);

  /**
   * 2. L1 / L2 cache check
   * - 동일 사이트 반복 discovery 방지
   */
  const cached = await getSiteCache(normalizedUrl);
  if (cached) return cached;

  /**
   * 3. HTML fetch
   * - RSS discovery의 시작점
   */
  let html: string;

  try {
    html = await fetchHtml(normalizedUrl);
  } catch (_err) {
    /**
     * HARD FAILURE
     * - 사이트 자체 접근 불가
     * - discovery 불가능
     */
    throw new Error("SITE_FETCH_FAILED");
  }

  /**
   * 4. Strategy 1: rel 기반 RSS 추출 (strong signal)
   * - 가장 신뢰도 높은 RSS source
   */
  const relFeeds = extractRelFeed(html);

  if (relFeeds.length > 0) {
    const validated = await validateAndScore(relFeeds, normalizedUrl);

    if (validated.best) {
      const result = buildResult(validated.best, html);

      await setSiteCache(normalizedUrl, result);
      return result;
    }
  }

  /**
   * 5. Strategy 2: common feed probing (/feed, /rss ...)
   * - CMS 기반 fallback
   * - 병렬 실행
   */
  const probedFeeds = await probeCommonFeeds(normalizedUrl);

  if (probedFeeds.length > 0) {
    const validated = await validateAndScore(probedFeeds, normalizedUrl);

    if (validated.best) {
      const result = buildResult(validated.best, html);

      await setSiteCache(normalizedUrl, result);
      return result;
    }
  }

  /**
   * 6. Strategy 3: CMS heuristic detection
   * - WordPress / Medium / Ghost 등 패턴 기반
   */
  const cmsFeeds = detectCmsFeed(normalizedUrl, html);

  if (cmsFeeds.length > 0) {
    const validated = await validateAndScore(cmsFeeds, normalizedUrl);

    if (validated.best) {
      const result = buildResult(validated.best, html);

      await setSiteCache(normalizedUrl, result);
      return result;
    }
  }

  /**
   * 7. Strategy 4: metadata fallback (weak signal)
   * - JSON-LD / hidden hints
   */
  const metaFeeds = extractMetaFeed(html);

  if (metaFeeds.length > 0) {
    const validated = await validateAndScore(metaFeeds, normalizedUrl);

    if (validated.best) {
      const result = buildResult(validated.best, html);

      await setSiteCache(normalizedUrl, result);
      return result;
    }
  }

  /**
   * 8. FINAL FALLBACK
   * - RSS 없음도 정상 케이스
   * - Site는 생성되지만 feed_url = null
   */
  const fallback: SiteDiscoveryResult = {
    url: normalizedUrl,
    name: extractSiteName(html),
    favicon_url: extractFavicon(html),
    feed_url: null,
  };

  await setSiteCache(normalizedUrl, fallback);
  return fallback;
}

/**
 * RSS 후보 validation + scoring 통합 함수
 *
 * 역할:
 * - RSS/Atom 유효성 검사
 * - parse 성공 여부 확인
 * - scoring 적용
 * - best 1개 선택
 */
async function validateAndScore(
  feedUrls: string[],
  _baseUrl: string,
): Promise<{ best: string | null }> {
  const results = await Promise.all(
    feedUrls.map(async (url) => {
      try {
        /**
         * RSS fetch + parse + normalize
         */
        const feed = await parseAndNormalizeFeed(url);

        if (!feed || feed.length === 0) {
          return null;
        }

        return {
          url,
          score: scoreFeeds(url, feed),
        };
      } catch {
        /**
         * Candidate failure
         * - invalid XML
         * - timeout
         * - 404
         */
        return null;
      }
    }),
  );

  /**
   * null 제거
   */
  const valid = results.filter(Boolean) as {
    url: string;
    score: number;
  }[];

  if (valid.length === 0) {
    return { best: null };
  }

  /**
   * scoring 기반 최적 feed 선택
   */
  valid.sort((a, b) => b.score - a.score);

  return {
    best: valid[0].url,
  };
}

/**
 * Site 메타 생성 함수
 */
function buildResult(feedUrl: string, html: string): SiteDiscoveryResult {
  return {
    url: extractCanonicalUrl(html),
    name: extractSiteName(html),
    favicon_url: extractFavicon(html),
    feed_url: feedUrl,
  };
}

/**
 * 사이트 이름 추출
 * priority:
 * 1. og:site_name
 * 2. title tag
 * 3. hostname fallback
 */
function extractSiteName(_html: string): string {
  // simplified placeholder logic
  return "unknown-site";
}

/**
 * favicon 추출
 */
function extractFavicon(_html: string): string | null {
  return null;
}

/**
 * canonical url 추출
 */
function extractCanonicalUrl(_html: string): string {
  return "unknown-url";
}
