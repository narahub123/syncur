import * as cheerio from "cheerio";
import { AnyNode, Element } from "domhandler";
import { FieldExtractor, ListingPageConfig } from "./types";

// =====================
// 상수
// =====================

/** 날짜 관련 attribute — datetime이 있으면 text보다 우선 */
const DATE_ATTRS = ["datetime", "data-date", "data-time", "data-published"];

/** 날짜 텍스트 패턴 */
const DATE_PATTERN = /\d{4}[-./]\d{1,2}[-./]\d{1,2}/;

/** 제외할 노이즈 영역 */
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

/** 제외할 컨테이너 */
const EXCLUDE_CONTAINER_SELECTORS = [
  "[class*='tag']",
  "[class*='label']",
  "[class*='social']",
  "[class*='share']",
  "[class*='breadcrumb']",
  "[class*='tab']",
  "[class*='dropdown']",
];

// =====================
// 유틸
// =====================

/** 요소의 고유 셀렉터 생성 — tag + id/class 조합 */
function getSelector(el: AnyNode, $: cheerio.CheerioAPI): string {
  const tag = (el as Element).tagName?.toLowerCase() ?? "div";
  const id = $(el).attr("id");
  if (id) return `${tag}#${id}`;

  const classes =
    $(el)
      .attr("class")
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2) // 클래스 최대 2개만 사용
      .map((c) => `.${c}`)
      .join("") ?? "";

  return `${tag}${classes}` || tag;
}

/** 항목 안에서 날짜를 추출할 FieldExtractor 탐색 */
function findPublishedAtExtractor(
  item: AnyNode,
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // 1. datetime attribute를 가진 요소 탐색 (가장 신뢰도 높음)
  for (const attr of DATE_ATTRS) {
    const el = $(item).find(`[${attr}]`).first();
    if (el.length > 0) {
      return {
        selector: getSelector(el[0], $),
        extract: "attr",
        attr,
      };
    }
  }

  // 2. 날짜 텍스트 패턴을 가진 요소 탐색
  let found: FieldExtractor | null = null;
  $(item)
    .find("*")
    .each((_, el) => {
      if (found) return;
      const text = $(el).text().trim();
      if (DATE_PATTERN.test(text) && $(el).children().length === 0) {
        found = {
          selector: getSelector(el, $),
          extract: "text",
        };
      }
    });

  return found;
}

/** 항목 안에서 링크/제목 FieldExtractor 탐색 */
function findLinkAndTitleExtractor(
  item: AnyNode,
  $: cheerio.CheerioAPI,
  baseUrl: string,
): { link: FieldExtractor; title: FieldExtractor } | null {
  const origin = new URL(baseUrl).origin;

  // 항목 내부 링크 중 같은 도메인 내 다른 경로로 향하는 것 탐색
  const links = $(item)
    .find("a[href]")
    .toArray()
    .filter((a) => {
      const href = $(a).attr("href") ?? "";
      try {
        const resolved = new URL(href, baseUrl).toString();
        return resolved.startsWith(origin) && resolved !== baseUrl;
      } catch {
        return false;
      }
    });

  if (links.length === 0) return null;

  // 텍스트가 가장 긴 링크를 제목 링크로 선택
  const titleLink = links.reduce((best, cur) =>
    $(cur).text().trim().length > $(best).text().trim().length ? cur : best,
  );

  const linkSelector = getSelector(titleLink, $);

  return {
    link: {
      selector: linkSelector,
      extract: "attr",
      attr: "href",
    },
    title: {
      selector: linkSelector,
      extract: "text",
    },
  };
}

// =====================
// 메인 함수
// =====================

/**
 * 목록 페이지 DOM을 분석해 ParserConfig를 추출합니다.
 * scoreByContent에서 fetch한 DOM을 재사용합니다.
 *
 * @param url - 목록 페이지 URL
 * @param dom - scoreByContent에서 반환한 Cheerio DOM
 * @returns ListingPageConfig | null — 추출 실패 시 null
 */
export function extractParserConfig(
  url: string,
  dom: cheerio.CheerioAPI,
): ListingPageConfig | null {
  const $ = dom;

  // ── 1. 노이즈 영역 제거 ─────────────────────────────────
  NOISE_REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

  // ── 2. 반복 구조 탐지 (scoreByContent와 동일한 방식) ────
  const origin = new URL(url).origin;

  interface ContainerCandidate {
    el: AnyNode;
    itemCount: number;
  }

  const candidates: ContainerCandidate[] = [];

  $("*").each((_, el) => {
    const isExcluded = EXCLUDE_CONTAINER_SELECTORS.some(
      (excSel) => $(el).is(excSel) || $(el).closest(excSel).length > 0,
    );
    if (isExcluded) return;

    const children = $(el).children();
    if (children.length < 3) return;

    // 자식 태그 반복 비율 확인
    const tagCounts: Record<string, number> = {};
    children.each((_, child) => {
      const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    });

    const maxTagCount = Math.max(...Object.values(tagCounts));
    const repeatRatio = maxTagCount / children.length;
    if (repeatRatio < 0.7) return;

    // 상세 링크를 가진 항목 수 확인
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
      candidates.push({ el, itemCount: withDetailLinks.length });
    }
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.itemCount - a.itemCount);
  const bestContainer = candidates[0].el;

  // ── 3. itemSelector 생성 ────────────────────────────────
  // 컨테이너 > 가장 많이 반복되는 자식 태그 조합
  const children = $(bestContainer).children();
  const tagCounts: Record<string, number> = {};
  children.each((_, child) => {
    const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  });
  const dominantTag = Object.entries(tagCounts).sort(
    (a, b) => b[1] - a[1],
  )[0][0];
  const containerSelector = getSelector(bestContainer, $);
  const itemSelector = `${containerSelector} > ${dominantTag}`;

  // ── 4. 대표 항목에서 필드 추출 ──────────────────────────
  // 첫 번째 항목을 대표로 사용
  const firstItem = $(bestContainer).children(dominantTag).first()[0];
  if (!firstItem) return null;

  const linkAndTitle = findLinkAndTitleExtractor(firstItem, $, url);
  if (!linkAndTitle) return null;

  const publishedAt = findPublishedAtExtractor(firstItem, $);

  // ── 5. 페이지네이션 탐지 ────────────────────────────────
  let nextPageSelector: string | null = null;

  const nextSelectors = [
    "[rel='next']",
    ".next a",
    ".next",
    "[class*='next']",
    "a[href*='page=']",
    "a[href*='p=']",
  ];

  for (const sel of nextSelectors) {
    if ($(sel).length > 0) {
      nextPageSelector = sel;
      break;
    }
  }

  return {
    itemSelector,
    fields: {
      title: linkAndTitle.title,
      link: linkAndTitle.link,
      publishedAt,
    },
    pagination: {
      nextPageSelector,
    },
  };
}
