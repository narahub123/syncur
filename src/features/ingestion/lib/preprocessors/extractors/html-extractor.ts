import { JSDOM } from "jsdom";
import { HtmlContent } from "../types";
import { HTML_REMOVE_TAGS } from "../constants";

export function extractHtml(dom: JSDOM): HtmlContent {
  const document = dom.window.document;

  // DOM Clone (원본 보존)
  const clonedDocument = document.cloneNode(true) as Document;

  // 불필요한 태그 제거
  HTML_REMOVE_TAGS.forEach((tag) => {
    clonedDocument.querySelectorAll(tag).forEach((element) => {
      element.remove();
    });
  });

  const head = clonedDocument.head?.innerHTML.trim() ?? "";
  const body = clonedDocument.body?.innerHTML.trim() ?? "";

  const main =
    clonedDocument.querySelector("main")?.innerHTML.trim() ?? undefined;

  return {
    head,
    body,
    main,
  };
}
