import * as cheerio from "cheerio";
import { AnyNode, Element } from "domhandler";
import { DetailPageConfig, FieldExtractor } from "../types";

// =====================
// 상수
// =====================

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
  "[class*='related']",
  "[class*='recommend']",
  "[class*='comment']",
];

const DATE_ATTRS = ["datetime", "data-date", "data-time", "data-published"];
const DATE_PATTERN = /\d{4}[-./]\d{1,2}[-./]\d{1,2}/;

// =====================
// 유틸
// =====================

function getSelector(el: AnyNode, $: cheerio.CheerioAPI): string {
  const tag = (el as Element).tagName?.toLowerCase() ?? "div";
  const id = $(el).attr("id");
  if (id) return `${tag}#${id}`;

  const classes =
    $(el)
      .attr("class")
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join("") ?? "";

  return `${tag}${classes}` || tag;
}

// =====================
// 필드별 추출 함수
// =====================

function findTitleExtractor($: cheerio.CheerioAPI): FieldExtractor {
  // 1. <h1> 우선
  if ($("h1").length > 0) {
    return { selector: getSelector($("h1")[0], $), extract: "text" };
  }
  // 2. <title> fallback
  return { selector: "title", extract: "text" };
}

function findDescriptionExtractor(
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // 1. og:description 메타 태그
  if ($("meta[property='og:description']").length > 0) {
    return {
      selector: "meta[property='og:description']",
      extract: "attr",
      attr: "content",
    };
  }
  // 2. meta description
  if ($("meta[name='description']").length > 0) {
    return {
      selector: "meta[name='description']",
      extract: "attr",
      attr: "content",
    };
  }
  // 3. 본문 영역 첫 번째 <p>
  const contentSelectors = [
    "article p",
    "main p",
    "[class*='content'] p",
    "[class*='body'] p",
  ];
  for (const sel of contentSelectors) {
    if ($(sel).first().length > 0) {
      return { selector: sel, extract: "text" };
    }
  }
  return null;
}

function findAuthorExtractor($: cheerio.CheerioAPI): FieldExtractor | null {
  // 1. meta author
  if ($("meta[name='author']").length > 0) {
    return {
      selector: "meta[name='author']",
      extract: "attr",
      attr: "content",
    };
  }
  // 2. 클래스 기반
  const authorSelectors = [
    "[class*='author']",
    "[class*='writer']",
    "[rel='author']",
    ".by",
  ];
  for (const sel of authorSelectors) {
    if ($(sel).first().length > 0) {
      return { selector: sel, extract: "text" };
    }
  }
  return null;
}

function findPublishedAtExtractor(
  $: cheerio.CheerioAPI,
): FieldExtractor | null {
  // 1. datetime attribute
  for (const attr of DATE_ATTRS) {
    const el = $(`[${attr}]`).first();
    if (el.length > 0) {
      return { selector: getSelector(el[0], $), extract: "attr", attr };
    }
  }
  // 2. meta 태그
  const metaSelectors = [
    "meta[property='article:published_time']",
    "meta[name='pubdate']",
    "meta[name='date']",
  ];
  for (const sel of metaSelectors) {
    if ($(sel).length > 0) {
      return { selector: sel, extract: "attr", attr: "content" };
    }
  }
  // 3. 날짜 텍스트 패턴을 가진 요소 탐색
  let found: FieldExtractor | null = null;
  $("*").each((_, el) => {
    if (found) return;
    const text = $(el).text().trim();
    if (DATE_PATTERN.test(text) && $(el).children().length === 0) {
      found = { selector: getSelector(el, $), extract: "text" };
    }
  });
  return found;
}

function findCategoriesExtractor($: cheerio.CheerioAPI): FieldExtractor | null {
  // 1. meta keywords
  if ($("meta[name='keywords']").length > 0) {
    return {
      selector: "meta[name='keywords']",
      extract: "attr",
      attr: "content",
    };
  }
  // 2. article:tag
  if ($("meta[property='article:tag']").length > 0) {
    return {
      selector: "meta[property='article:tag']",
      extract: "attr",
      attr: "content",
    };
  }
  // 3. 클래스 기반 태그/카테고리 영역
  const categorySelectors = [
    "[class*='category']",
    "[class*='tag']",
    "[class*='label']",
    "[rel='category']",
  ];
  for (const sel of categorySelectors) {
    if ($(sel).first().length > 0) {
      return { selector: sel, extract: "text" };
    }
  }
  return null;
}

// =====================
// 메인 함수
// =====================

/**
 * 상세 페이지 DOM을 분석해 DetailPageConfig를 추출합니다.
 *
 * @param url - 상세 페이지 URL (대표 샘플)
 * @param dom - fetch한 Cheerio DOM
 */
export function extractDetailPageConfig(
  url: string,
  dom: cheerio.CheerioAPI,
): DetailPageConfig | null {
  const $ = dom;

  // 노이즈 영역 제거
  NOISE_REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

  const title = findTitleExtractor($);
  const description = findDescriptionExtractor($);
  const author = findAuthorExtractor($);
  const publishedAt = findPublishedAtExtractor($);
  const categories = findCategoriesExtractor($);

  // title은 필수 — 없으면 null 반환
  if (!title) return null;

  return {
    title,
    description,
    author,
    publishedAt,
    categories,
  };
}
