import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
import { HierarchyAnalysisResult } from "./types";

/**
 * 목록 항목과 현재 페이지의 계층 관계를 분석합니다.
 *
 * 현재 페이지와 목록 내 링크들의 경로를 비교하여
 * Parent-Child 또는 Sibling 관계를 판정합니다.
 *
 * @param {string} url - 분석 대상 URL
 * @param {cheerio.Cheerio<AnyNode>} listItems - 반복 구조에서 추출한 목록 항목
 * @returns {HierarchyAnalysisResult} 계층 관계 분석 결과를 반환합니다.
 */
export function analyzeHierarchy(
  dom: cheerio.CheerioAPI,
  url: string,
  listItems: cheerio.Cheerio<AnyNode>,
): HierarchyAnalysisResult {
  const origin = new URL(url).origin;

  // 현재 페이지의 경로를 분리합니다.
  const currentPath = new URL(url).pathname.split("/").filter(Boolean);

  // 중복 투표를 방지하기 위해 Set을 사용합니다.
  const candidateLinks = new Set<string>();

  // 목록 내의 상세 페이지 후보 링크를 수집합니다.
  listItems.each((_, el) => {
    dom(el)
      .find("a[href]")
      .each((_, anchor) => {
        const href = dom(anchor).attr("href");

        if (!href) {
          return;
        }

        try {
          const fullUrl = new URL(href, url).toString();

          if (fullUrl.startsWith(origin) && fullUrl !== url) {
            candidateLinks.add(fullUrl);
          }
        } catch {
          // 잘못된 URL은 무시합니다.
        }
      });
  });

  let parentCount = 0;
  let siblingCount = 0;

  // 링크들의 계층 관계를 분석합니다.
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
        if (linkPath.length > currentPath.length) {
          parentCount++;
        } else if (linkPath.length === currentPath.length) {
          siblingCount++;
        }
      }
    } catch {
      // 잘못된 URL은 무시합니다.
    }
  }

  const total = parentCount + siblingCount;

  if (total < 3) {
    return {
      isParent: false,
      parentRatio: 0,
      isSibling: false,
      siblingRatio: 0,
    };
  }

  const parentRatio = parentCount / total;
  const siblingRatio = siblingCount / total;

  return {
    isParent: parentRatio >= 0.7,
    parentRatio,
    isSibling: siblingRatio >= 0.7,
    siblingRatio,
  };
}
