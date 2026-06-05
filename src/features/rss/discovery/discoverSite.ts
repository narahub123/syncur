import { fetchHtml } from "../fetcher/fetchHtml";
import { extractRelFeed } from "../strategies/extractRelFeed";
import { probeCommonFeeds } from "../strategies/probeCommonFeeds";
import { detectCmsFeed } from "../strategies/detectCmsFeed";
import { extractMetaFeed } from "../strategies/extractMetaFeed";
import { scoreFeeds } from "../scoring/scoreFeed";
import { parseAndNormalizeFeed } from "../parser/parseFeed";
import { getSiteCache, setSiteCache } from "../cache/siteCache";
import { SiteDiscoveryResult } from "./types";
import { normalizeSiteUrl } from "@/shared/utils/url";
import { decodeHtmlEntities } from "@/shared/utils/decodeHtmlEntities";

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
  } catch (err) {
    console.error("[SITE FETCH ERROR]", err);
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

  const rssCandidates = relFeeds.filter((url) => {
    if (!url) return false;
    if (url.startsWith("/")) return false;
    if (url.includes("favicon")) return false;
    if (url.includes("svg")) return false;
    return url.includes("rss") || url.includes("feed") || url.endsWith(".xml");
  });

  if (rssCandidates.length > 0) {
    const validated = await validateAndScore(rssCandidates, normalizedUrl);

    if (validated.best) {
      const result = buildResult(normalizedUrl, validated.best, html);

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
      const result = buildResult(normalizedUrl, validated.best, html);

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
      const result = buildResult(normalizedUrl, validated.best, html);

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
      const result = buildResult(normalizedUrl, validated.best, html);

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
    name: extractSiteName(html, normalizedUrl),
    favicon_url: extractFavicon(html, normalizedUrl),
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
         * 1. RSS parse 시도
         */

        const res = await fetch(url);
        const text = await res.text();

        /**
         * RSS/Atom 여부 사전 검증
         *
         * 일부 사이트(Medium 등)는
         * /feed URL이 존재하더라도 실제 RSS XML 대신
         * HTML 페이지를 반환하는 경우가 있음.
         *
         * XML 파서(parseStringPromise)에 HTML을 전달하면
         * 불필요한 파싱 예외가 발생하므로,
         * RSS/Atom으로 보이는 경우에만 파싱을 진행한다.
         */
        const trimmed = text.trim();

        const looksLikeFeed =
          trimmed.startsWith("<?xml") ||
          trimmed.includes("<rss") ||
          trimmed.includes("<feed");

        if (!looksLikeFeed) {
          return null;
        }

        const feed = await parseAndNormalizeFeed(text);

        /**
         * ❗ 핵심 변경:
         * "완전히 실패"만 null 처리
         * items 0개는 버리지 않음
         */
        if (!feed) return null;

        const score = scoreFeeds(url, feed);

        return {
          url,
          score,
        };
      } catch (err) {
        console.error("[PARSE ERROR]:", err);

        /**
         * ❗ 여기만 fail
         * (진짜 깨진 RSS만 제거)
         */
        return null;
      }
    }),
  );

  const valid = results.filter(Boolean) as { url: string; score: number }[];

  if (valid.length === 0) {
    return { best: null };
  }

  valid.sort((a, b) => b.score - a.score);

  return { best: valid[0].url };
}

/**
 * Site 메타 생성 함수
 */
function buildResult(
  siteUrl: string,
  feedUrl: string,
  html: string,
): SiteDiscoveryResult {
  return {
    url: siteUrl,
    name: extractSiteName(html, siteUrl),
    favicon_url: extractFavicon(html, siteUrl),
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

function extractSiteName(html: string, siteUrl: string): string {
  const ogSiteName = html.match(
    /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i,
  );

  if (ogSiteName?.[1]?.trim()) {
    return decodeHtmlEntities(ogSiteName[1].replace(/\s+/g, " ").trim());
  }

  const title = html.match(/<title[^>]*>(.*?)<\/title>/i);

  if (title?.[1]?.trim()) {
    return decodeHtmlEntities(title[1].replace(/\s+/g, " ").trim());
  }

  try {
    const hostname = new URL(siteUrl).hostname;

    return hostname.replace(/^www\./, "");
  } catch {
    return "unknown-site";
  }
}

/**
 * favicon 추출
 * priority:
 * 1. icon
 * 2. shortcut icon
 * 3. apple-touch-icon
 * 4. /favicon.ico fallback
 */
function extractFavicon(html: string, siteUrl: string): string | null {
  const patterns = [
    /<link[^>]*rel=["'](?:shortcut\s+icon|icon)["'][^>]*href=["']([^"']+)["'][^>]*>/i,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut\s+icon|icon)["'][^>]*>/i,
    /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (!match?.[1]) continue;

    try {
      return new URL(match[1], siteUrl).href;
    } catch {
      continue;
    }
  }

  try {
    return new URL("/favicon.ico", siteUrl).href;
  } catch {
    return null;
  }
}
