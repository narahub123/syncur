import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import { FieldExtractor } from "../../../types";

/**
 * 제목(title) 추출 pipeline
 *
 * 우선순위:
 * 1. h1
 * 2. title tag fallback
 *
 * @param $ - cheerio DOM 인스턴스
 * @returns FieldExtractor (title은 항상 fallback이 있어 null이 아님)
 */
export function runTitlePipeline($: cheerio.CheerioAPI): FieldExtractor {
  // =====================
  // 1단계: h1 기반 추출
  // =====================
  const h1 = $("h1").first();

  // h1이 존재하면 해당 요소 기반 title 추출
  if (h1.length > 0) {
    return {
      selector: getSelector(h1[0], $),
      extract: "text",
    };
  }

  // =====================
  // 2단계: title fallback
  // =====================
  return {
    selector: "title",
    extract: "text",
  };
}

/**
 * DOM 요소로부터 CSS selector를 생성합니다.
 *
 * @param el - 대상 DOM 노드
 * @param $ - cheerio 인스턴스
 * @returns selector 문자열
 */
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
