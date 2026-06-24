import { JSDOM } from "jsdom";
import {
  IMPORTANT_SCRIPT_TYPE,
  ImportantScript,
  ImportantScriptType,
} from "../types";
import { IMPORTANT_SCRIPT_IDS, IMPORTANT_SCRIPT_KEYWORDS } from "../constants";

export function extractScripts(dom: JSDOM): ImportantScript[] {
  const document = dom.window.document;

  const scripts: ImportantScript[] = [];

  document.querySelectorAll("script").forEach((script) => {
    const type = script.getAttribute("type") ?? "";
    const id = script.id;
    const content = script.textContent?.trim() ?? "";

    // JSON-LD
    if (type === IMPORTANT_SCRIPT_TYPE.JSON_LD) {
      scripts.push({
        type: IMPORTANT_SCRIPT_TYPE.JSON_LD,
        content,
      });
      return;
    }

    // ID 기반
    if (IMPORTANT_SCRIPT_IDS.includes(id)) {
      scripts.push({
        type: id as ImportantScriptType,
        content,
      });
      return;
    }

    // 내용 기반
    const keyword = IMPORTANT_SCRIPT_KEYWORDS.find((keyword) =>
      content.includes(keyword),
    );

    if (keyword) {
      scripts.push({
        type: keyword as ImportantScriptType,
        content,
      });
    }
  });

  return scripts;
}
