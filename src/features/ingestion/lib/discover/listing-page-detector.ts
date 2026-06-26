import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import { extractListingPageConfig } from "./parser/extractListingPageConfig";
import { ListingPageConfig } from "./types";

// =====================
// Types
// =====================

export interface ListingPageCandidate {
  url: string;
  title: string;
  lastUpdated: string | null;
  parserConfig: ListingPageConfig | null;
  score: number;
  reason: string[];
}

export interface ListingDetectionResult {
  candidates: ListingPageCandidate[];
  fromCache: boolean;
}

// =====================
// 상수
// =====================

/** URL 경로에 이 단어가 포함되면 목록 페이지 가능성 높음 (보조 신호로만 사용) */
const LISTING_PATH_KEYWORDS = [
  "board",
  "boards",
  "news",
  "notice",
  "notices",
  "post",
  "posts",
  "list",
  "listing",
  "article",
  "articles",
  "blog",
  "blogs",
  "feed",
  "community",
  "forum",
  "forums",
  "announce",
  "announcement",
  "press",
  "story",
  "stories",
  "update",
  "updates",
  "archive",
  "category",
  "categories",
  "tag",
  "tags",
  "topic",
  "topics",
  "공지",
  "게시판",
  "뉴스",
  "공고",
  "자료",
];

/** 단건 글 URL 패턴 — 이 패턴이면 목록 페이지가 아닐 가능성 높음 */
const DETAIL_PAGE_PATTERNS = [
  /\/\d{4}\/\d{2}\/\d{2}\//,
  /[?&](id|idx|seq|no)=\d+/,
  /\/(view|detail|read)\//,
];

/**
 * 노이즈로 제거할 셀렉터
 * nav/header 전체를 막지 않고 명확히 부수적인 요소만 제거
 */
const NOISE_SELECTORS = [
  "footer a",
  ".sitemap a",
  "#sitemap a",
  ".breadcrumb a",
  ".pagination a",
  ".gnb a",
  ".lnb a",
  ".snb a",
];

/** 날짜 패턴 */
const DATE_PATTERN = /\d{4}[-./]\d{1,2}[-./]\d{1,2}/g;

/** 작성자 관련 셀렉터 */
const AUTHOR_SELECTORS = [
  "[class*='author']",
  "[class*='writer']",
  "[class*='nick']",
  ".by",
];

// =====================
// 유틸
// =====================

function getBaseUrl(url: string): string {
  const u = new URL(url);
  return `${u.protocol}//${u.host}`;
}

function resolveUrl(href: string, base: string): string | null {
  try {
    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("javascript:")
    ) {
      return null;
    }
    return new URL(href, base).toString();
  } catch {
    return null;
  }
}

function isSameDomain(url: string, base: string): boolean {
  try {
    return new URL(url).host === new URL(base).host;
  } catch {
    return false;
  }
}

function isDetailPage(url: string): boolean {
  return DETAIL_PAGE_PATTERNS.some((p) => p.test(url));
}

// =====================
// 1차 점수: URL 패턴 (fetch 없이)
// =====================

function scoreByUrl(
  url: string,
  anchorText: string,
): { score: number; reason: string[] } {
  const reason: string[] = [];
  let score = 0;

  const path = new URL(url).pathname.toLowerCase();
  const text = anchorText.toLowerCase();

  for (const kw of LISTING_PATH_KEYWORDS) {
    if (path.includes(kw) || text.includes(kw)) {
      score += 8;
      reason.push(`키워드 매칭: "${kw}"`);
      break;
    }
  }

  const depth = path.split("/").filter(Boolean).length;
  if (depth === 1) {
    score += 5;
    reason.push("경로 깊이 1단계");
  } else if (depth === 2) {
    score += 4;
    reason.push("경로 깊이 2단계");
  } else if (depth === 3) {
    score += 2;
    reason.push("경로 깊이 3단계");
  }

  if (!url.includes("?")) {
    score += 3;
    reason.push("쿼리스트링 없음");
  }

  if (isDetailPage(url)) {
    score -= 15;
    reason.push("단건 페이지 패턴");
  }

  return { score, reason };
}

// =====================
// 2차 점수: 페이지 내용 (fetch 후)
// =====================

async function scoreByContent(
  url: string,
  headers: Record<string, string>,
): Promise<{
  score: number;
  reason: string[];
  title: string | null;
  lastUpdated: string | null;
  dom: cheerio.CheerioAPI | null;
}> {
  const reason: string[] = [];
  let score = 0;
  let title: string | null = null;
  let lastUpdated: string | null = null;
  let dom: cheerio.CheerioAPI | null = null;

  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { score, reason, title, lastUpdated, dom };

    const html = await res.text();
    const $ = cheerio.load(html);
    dom = $;

    // ── 0. 페이지 title 추출 ────────────────────────────────
    title =
      $("title").first().text().trim() || $("h1").first().text().trim() || null;

    // ── 1. 노이즈 영역 DOM에서 제거 ────────────────────────
    const NOISE_REMOVE_SELECTORS = [
      "nav",
      "header",
      "footer",
      "[class*='nav']",
      "[class*='menu']",
      "[class*='banner']",
      "[class*='ad']",
      "[class*='cookie']",
      "[class*='popup']",
    ];
    NOISE_REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

    // ── 2. 반복 구조 탐지 (구조 기반) ──────────────────────
    const EXCLUDE_CONTAINER_SELECTORS = [
      "[class*='tag']",
      "[class*='label']",
      "[class*='social']",
      "[class*='share']",
      "[class*='breadcrumb']",
      "[class*='tab']",
      "[class*='dropdown']",
    ];

    const origin = new URL(url).origin;

    interface ContainerCandidate {
      el: AnyNode;
      itemCount: number;
      linkCount: number;
    }

    const candidates: ContainerCandidate[] = [];

    $("*").each((_, el) => {
      const isExcluded = EXCLUDE_CONTAINER_SELECTORS.some(
        (excSel) => $(el).is(excSel) || $(el).closest(excSel).length > 0,
      );
      if (isExcluded) return;

      const children = $(el).children();
      if (children.length < 3) return;

      const tagCounts: Record<string, number> = {};
      children.each((_, child) => {
        const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      });

      const maxTagCount = Math.max(...Object.values(tagCounts));
      const repeatRatio = maxTagCount / children.length;

      if (repeatRatio < 0.7) return;

      const withDetailLinks = children.filter((_, child) => {
        return $(child)
          .find("a[href]")
          .toArray()
          .some((a) => {
            const href = $(a).attr("href") ?? "";
            try {
              const resolved = new URL(href, url).toString();
              return resolved.startsWith(origin) && resolved !== url;
            } catch {
              return false;
            }
          });
      });

      if (withDetailLinks.length >= 3) {
        candidates.push({
          el,
          itemCount: withDetailLinks.length,
          linkCount: withDetailLinks.length,
        });
      }
    });

    candidates.sort((a, b) => b.itemCount - a.itemCount);
    const best = candidates[0] ?? null;

    let listItems: cheerio.Cheerio<AnyNode> | null = null;

    if (best) {
      listItems = $(best.el)
        .children()
        .filter((_, child) => {
          return $(child)
            .find("a[href]")
            .toArray()
            .some((a) => {
              const href = $(a).attr("href") ?? "";
              try {
                const resolved = new URL(href, url).toString();
                return resolved.startsWith(origin) && resolved !== url;
              } catch {
                return false;
              }
            });
        });
      score += 15;
      reason.push(`반복 구조 발견 (${best.itemCount}개 항목)`);
    }

    if (!listItems) return { score, reason, title, lastUpdated, dom };

    // ── 3. 항목별 날짜 다양성 + lastUpdated ─────────────────
    const datesPerItem: string[] = [];
    listItems.each((_, el) => {
      const matches = $(el).text().match(DATE_PATTERN);
      if (matches) datesPerItem.push(matches[0]);
    });

    if (datesPerItem.length >= 3) {
      const uniqueDates = new Set(datesPerItem);
      if (uniqueDates.size >= 2) {
        score += 20;
        reason.push(`다양한 날짜 발견 (${uniqueDates.size}종류)`);
        lastUpdated =
          datesPerItem
            .map((d) => d.replace(/[./]/g, "-"))
            .sort()
            .at(-1) ?? null;
      } else {
        score -= 5;
        reason.push("날짜 모두 동일 (정적 데이터 의심)");
      }
    }

    // ── 4. 작성자 정보 반복 ─────────────────────────────────
    let authorHitCount = 0;
    for (const sel of AUTHOR_SELECTORS) {
      listItems.each((_, el) => {
        if ($(el).find(sel).length > 0) authorHitCount++;
      });
      if (authorHitCount >= 3) break;
    }
    if (authorHitCount >= 3) {
      score += 10;
      reason.push(`작성자 정보 반복 (${authorHitCount}개 항목)`);
    }

    // ── 5. 페이지네이션 ─────────────────────────────────────
    const hasPagination =
      $("[class*='pag']").length > 0 ||
      $("a[href*='page=']").length > 0 ||
      $("a[href*='p=']").length > 0 ||
      $(".next, .prev, [rel='next'], [rel='prev']").length > 0;

    if (hasPagination) {
      score += 15;
      reason.push("페이지네이션 존재");
    }
  } catch {
    // fetch 실패 무시
  }

  return { score, reason, title, lastUpdated, dom };
}

// =====================
// 메인 함수
// =====================

export async function detectListingPages(
  homeUrl: string,
  dom: cheerio.CheerioAPI,
  headers: Record<string, string> = {},
  maxProbe = 10,
): Promise<ListingDetectionResult> {
  const base = getBaseUrl(homeUrl);
  const $home = dom;

  // ── 1단계: 노이즈 링크 수집 ─────────────────────────────
  const noiseSet = new Set<string>();
  NOISE_SELECTORS.forEach((sel) => {
    $home(sel).each((_, el) => {
      const href = $home(el).attr("href");
      const resolved = resolveUrl(href ?? "", base);
      if (resolved) noiseSet.add(resolved);
    });
  });

  // ── 2단계: 내부 링크 전체 수집 ──────────────────────────
  const linkMap = new Map<string, string>();
  $home("a[href]").each((_, el) => {
    const href = $home(el).attr("href") ?? "";
    const resolved = resolveUrl(href, homeUrl);
    if (!resolved) return;
    if (!isSameDomain(resolved, homeUrl)) return;
    if (resolved === homeUrl || resolved === base || resolved === base + "/")
      return;
    if (noiseSet.has(resolved)) return;
    if (!linkMap.has(resolved)) {
      linkMap.set(resolved, $home(el).text().trim());
    }
  });

  // ── 3단계: URL 패턴으로 1차 점수 ────────────────────────
  const scored: ListingPageCandidate[] = [];
  for (const [url, text] of linkMap.entries()) {
    const { score, reason } = scoreByUrl(url, text);
    if (score > 0) {
      scored.push({
        url,
        title: text || url,
        lastUpdated: null,
        parserConfig: null,
        score,
        reason,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // ── 4단계: 상위 후보 fetch 검증 ─────────────────────────
  const probeTargets = scored.slice(0, maxProbe);
  await Promise.all(
    probeTargets.map(async (c) => {
      const { score, reason, title, lastUpdated, dom } = await scoreByContent(
        c.url,
        headers,
      );
      c.score += score;
      c.reason.push(...reason);
      if (title) c.title = title;
      c.lastUpdated = lastUpdated;

      // ── 5단계: MIN_SCORE 통과 시 ListingPageConfig 추출 ────────
      if (c.score >= 20 && dom) {
        c.parserConfig = extractListingPageConfig(c.url, dom);
      }
    }),
  );

  // ── 6단계: 최종 정렬 및 필터 ────────────────────────────
  const MIN_SCORE = 20;
  const final = probeTargets
    .filter((c) => c.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  return { candidates: final, fromCache: false };
}
