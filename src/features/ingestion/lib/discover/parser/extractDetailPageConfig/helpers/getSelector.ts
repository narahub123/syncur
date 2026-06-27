import * as cheerio from "cheerio";
import { AnyNode, Element } from "domhandler";

export function getSelector(el: AnyNode, $: cheerio.CheerioAPI): string {
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
