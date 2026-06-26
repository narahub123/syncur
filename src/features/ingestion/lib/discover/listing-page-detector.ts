import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";

// =====================
// Types
// =====================

export interface ListingPageCandidate {
  url: string;
  title: string;
  lastUpdated: string | null;
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

/**
 * 키워드 매칭은 보조 신호로만 사용.
 * 키워드가 없어도 기본 점수(경로 깊이 + 쿼리스트링 없음)로
 * scoreByContent 검증 대상에 포함되도록 허들을 낮춤.
 */
function scoreByUrl(
  url: string,
  anchorText: string,
): { score: number; reason: string[] } {
  const reason: string[] = [];
  let score = 0;

  const path = new URL(url).pathname.toLowerCase();
  const text = anchorText.toLowerCase();

  // 키워드 매칭 — 보조 가산점
  for (const kw of LISTING_PATH_KEYWORDS) {
    if (path.includes(kw) || text.includes(kw)) {
      score += 8;
      reason.push(`키워드 매칭: "${kw}"`);
      break;
    }
  }

  // 경로 깊이
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

  // 쿼리스트링 없음
  if (!url.includes("?")) {
    score += 3;
    reason.push("쿼리스트링 없음");
  }

  // 단건 페이지 패턴 감점
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
}> {
  const reason: string[] = [];
  let score = 0;
  let title: string | null = null;
  let lastUpdated: string | null = null;

  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { score, reason, title, lastUpdated };

    const html = await res.text();
    const $ = cheerio.load(html);

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
    // 특정 태그/클래스에 의존하지 않고
    // "같은 depth에 같은 태그가 N개 이상 반복되는 부모 요소"를 탐색

    // 컨테이너 제외 셀렉터 — 이 안에 있는 컨테이너는 스킵
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

    // 모든 요소를 순회하면서 자식들이 반복 구조를 이루는지 확인
    $("*").each((_, el) => {
      // 제외 셀렉터에 해당하면 스킵
      const isExcluded = EXCLUDE_CONTAINER_SELECTORS.some(
        (excSel) => $(el).is(excSel) || $(el).closest(excSel).length > 0,
      );
      if (isExcluded) return;

      const children = $(el).children();
      if (children.length < 3) return;

      // 자식 태그 분포 확인 — 가장 많이 반복되는 태그의 비율이 높으면 반복 구조
      const tagCounts: Record<string, number> = {};
      children.each((_, child) => {
        const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      });

      const maxTagCount = Math.max(...Object.values(tagCounts));
      const repeatRatio = maxTagCount / children.length;

      // 자식의 70% 이상이 같은 태그면 반복 구조로 판단
      if (repeatRatio < 0.7) return;

      // 각 자식이 내부 상세 페이지로 향하는 링크를 가지는지 확인
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

    // 항목 수가 가장 많은 컨테이너 선택
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

    if (!listItems) return { score, reason, title, lastUpdated };

    // ── 2.5단계 URL 계층 관계 분석 ──────────
    if (listItems && listItems.length > 0) {
      const currentPath = new URL(url).pathname.split("/").filter(Boolean);

      // Set을 사용하여 동일한 링크가 여러 번 투표되는 것을 방지
      const candidateLinks = new Set<string>();

      listItems.each((_, el) => {
        $(el)
          .find("a[href]")
          .each((_, a) => {
            const href = $(a).attr("href");
            if (!href) return;
            try {
              const fullUrl = new URL(href, url).toString();
              if (fullUrl.startsWith(new URL(url).origin) && fullUrl !== url) {
                candidateLinks.add(fullUrl);
              }
            } catch {}
          });
      });

      if (candidateLinks.size > 0) {
        let parentCount = 0;
        let siblingCount = 0;

        for (const link of candidateLinks) {
          try {
            const linkPath = new URL(link).pathname.split("/").filter(Boolean);

            let commonDepth = 0;
            const minLen = Math.min(currentPath.length, linkPath.length);
            while (
              commonDepth < minLen &&
              currentPath[commonDepth] === linkPath[commonDepth]
            ) {
              commonDepth++;
            }

            if (commonDepth >= 1) {
              if (linkPath.length > currentPath.length) parentCount++;
              else if (linkPath.length === currentPath.length) siblingCount++;
            }
          } catch {}
        }

        // 절대 개수가 아닌 비율 기반 판정 (70% 기준)
        const total = parentCount + siblingCount;
        if (total >= 3) {
          // 최소 샘플 확보
          const parentRatio = parentCount / total;
          const siblingRatio = siblingCount / total;

          if (parentRatio >= 0.7) {
            score += 20;
            reason.push(
              `Parent-Child 관계 승리 (${(parentRatio * 100).toFixed(0)}%)`,
            );
          } else if (siblingRatio >= 0.7) {
            if (!url.includes("?page=") && !url.includes("?p=")) {
              score -= 30;
              reason.push(
                `Sibling 관계 승리 (${(siblingRatio * 100).toFixed(0)}%): 상세 페이지 내 부가 목록 의심`,
              );
            }
          }
        }
      }
    }

    // ── 2. 항목별 날짜 다양성 + lastUpdated ─────────────────
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
        // 가장 최근 날짜 — 문자열 정렬로 max 추출 (yyyy-mm-dd 정규화)
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

    // ── 3. 작성자 정보 반복 ─────────────────────────────────
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

    // ── 4. 페이지네이션 ─────────────────────────────────────
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

  return { score, reason, title, lastUpdated };
}

// =====================
// 메인 함수
// =====================

/**
 * 사이트 홈 HTML을 분석해 구독 가능한 목록 페이지 후보를 반환합니다.
 *
 * @param homeUrl  - 사이트 홈 URL (normalize된 상태)
 * @param dom      - fetchSite()에서 받은 Cheerio DOM
 * @param headers  - fetchSite에서 쓰는 헤더 (User-Agent 등)
 * @param maxProbe - 실제 fetch로 검증할 상위 후보 수 (기본 10)
 */
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
  const linkMap = new Map<string, string>(); // url → anchorText
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
  // 허들을 낮춰서 점수 > 0 이면 전부 후보로 올림
  const scored: ListingPageCandidate[] = [];
  for (const [url, text] of linkMap.entries()) {
    const { score, reason } = scoreByUrl(url, text);
    if (score > 0) {
      scored.push({
        url,
        title: text || url,
        lastUpdated: null,
        score,
        reason,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // ── 4단계: 상위 후보 fetch 검증 ─────────────────────────
  // maxProbe를 넉넉하게 잡아서 키워드 미매칭 URL도 검증 기회를 줌
  const probeTargets = scored.slice(0, maxProbe);
  await Promise.all(
    probeTargets.map(async (c) => {
      const { score, reason, title, lastUpdated } = await scoreByContent(
        c.url,
        headers,
      );
      c.score += score;
      c.reason.push(...reason);
      if (title) c.title = title;
      c.lastUpdated = lastUpdated;
    }),
  );

  // ── 5단계: 최종 정렬 및 필터 ────────────────────────────
  // scoreByContent에서 반복 구조(+15)가 확인된 것만 유의미하므로
  // 최소 점수를 15로 설정
  const MIN_SCORE = 20;
  const final = probeTargets
    .filter((c) => c.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  console.log("결과", final);
  return { candidates: final, fromCache: false };
}
