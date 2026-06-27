import * as cheerio from "cheerio";
import { AnyNode, Element } from "domhandler";

/** 요소의 고유 셀렉터 생성 — tag + id/class 조합 */
export function getSelector(el: AnyNode, $: cheerio.CheerioAPI): string {
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
