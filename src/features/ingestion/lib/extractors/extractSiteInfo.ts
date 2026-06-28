import { decodeHtmlEntities } from "@/shared/utils/decodeHtmlEntities";

// =====================
// Types
// =====================

export interface SiteInfo {
  name: string;
  favicon_url: string | null;
}

// =====================
// 유틸
// =====================

/**
 * 사이트 이름 추출
 *
 * 추출 우선순위:
 * 1. og:site_name
 * 2. title 태그
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
 * favicon URL 추출
 *
 * 추출 우선순위:
 * 1. icon / shortcut icon
 * 2. apple-touch-icon
 * 3. /favicon.ico fallback
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

// =====================
// 메인 함수
// =====================

/**
 * 사이트 기본 정보를 추출합니다.
 *
 * @param html - fetchSite에서 가져온 HTML 문자열
 * @param siteUrl - 사이트 URL (favicon 절대경로 변환용)
 * @returns SiteInfo — name, favicon_url
 */
export function extractSiteInfo(html: string, siteUrl: string): SiteInfo {
  return {
    name: extractSiteName(html, siteUrl),
    favicon_url: extractFavicon(html, siteUrl),
  };
}
