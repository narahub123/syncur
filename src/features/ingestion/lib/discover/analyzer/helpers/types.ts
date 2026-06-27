import * as cheerio from "cheerio";
import { AnyNode } from "domhandler";

/**
 * HTML 요청 결과입니다.
 */
export interface FetchContentResult {
  dom: cheerio.CheerioAPI;
}

export interface RepeatedStructureResult {
  listItems: cheerio.Cheerio<AnyNode> | null;
  itemCount: number;
}

export interface HierarchyAnalysisResult {
  isParent: boolean;
  parentRatio: number;
  isSibling: boolean;
  siblingRatio: number;
}

export interface DateAnalysisResult {
  hasVariousDates: boolean;
  uniqueDateCount: number;
  lastUpdated: string | null;
}
