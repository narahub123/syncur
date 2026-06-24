import { JSDOM } from "jsdom";

import { extractMetadata } from "./extractors/metadata-extractor";
import { extractFramework } from "./extractors/framework-extractor";
import { extractScripts } from "./extractors/script-extractor";
import { extractHtml } from "./extractors/html-extractor";
import { AnalysisInput } from "./types";

/**
 * DOM → AnalysisInput 변환 (Pure Orchestrator)
 */
export function preprocess(dom: JSDOM, url: string): AnalysisInput {
  return {
    url,

    metadata: extractMetadata(dom),

    framework: extractFramework(dom),

    importantScripts: extractScripts(dom),

    html: extractHtml(dom),
  };
}
