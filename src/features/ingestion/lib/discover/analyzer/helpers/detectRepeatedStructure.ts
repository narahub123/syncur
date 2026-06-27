import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import { EXCLUDE_CONTAINER_SELECTORS } from "./constants";
import { RepeatedStructureResult } from "./types";

/**
 * DOM의 반복 구조를 분석하여 목록 컨테이너를 탐지합니다.
 *
 * 반복되는 자식 구조와 상세 페이지 링크를 기반으로
 * 가장 목록 페이지일 가능성이 높은 컨테이너를 선택합니다.
 *
 * @param {string} url - 분석 대상 URL
 * @param {cheerio.CheerioAPI} dom - 분석할 페이지의 Cheerio 객체
 * @returns {RepeatedStructureResult} 반복 구조 분석 결과를 반환합니다.
 */
export function detectRepeatedStructure(
  url: string,
  dom: cheerio.CheerioAPI,
): RepeatedStructureResult {
  const origin = new URL(url).origin;

  interface ContainerCandidate {
    el: AnyNode;
    itemCount: number;
  }

  const candidates: ContainerCandidate[] = [];

  // 페이지 내 모든 요소를 순회하며 반복 구조 후보를 탐색합니다.
  dom("*").each((_, el) => {
    // 제외 대상 영역은 분석하지 않습니다.
    const isExcluded = EXCLUDE_CONTAINER_SELECTORS.some(
      (selector) =>
        dom(el).is(selector) || dom(el).closest(selector).length > 0,
    );

    if (isExcluded) {
      return;
    }

    // 자식 요소가 너무 적으면 목록 구조로 판단하지 않습니다.
    const children = dom(el).children();

    if (children.length < 3) {
      return;
    }

    // 자식 태그들의 반복 비율을 계산합니다.
    const tagCounts: Record<string, number> = {};

    children.each((_, child) => {
      const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    });

    const maxTagCount = Math.max(...Object.values(tagCounts));
    const repeatRatio = maxTagCount / children.length;

    // 동일 태그 비율이 낮으면 반복 구조가 아닙니다.
    if (repeatRatio < 0.7) {
      return;
    }

    // 실제 상세 페이지 링크가 포함된 자식만 계산합니다.
    const withDetailLinks = children.filter((_, child) => {
      return dom(child)
        .find("a[href]")
        .toArray()
        .some((anchor) => {
          const href = dom(anchor).attr("href") ?? "";

          try {
            const resolved = new URL(href, url).toString();

            return resolved.startsWith(origin) && resolved !== url;
          } catch {
            return false;
          }
        });
    });

    // 상세 페이지 링크가 충분하면 후보로 등록합니다.
    if (withDetailLinks.length >= 3) {
      candidates.push({
        el,
        itemCount: withDetailLinks.length,
      });
    }
  });

  // 가장 많은 반복 항목을 가진 컨테이너를 선택합니다.
  candidates.sort((a, b) => b.itemCount - a.itemCount);

  const best = candidates[0];

  if (!best) {
    return {
      listItems: null,
      itemCount: 0,
    };
  }

  // 최종 선택된 컨테이너의 목록 항목을 추출합니다.
  const listItems = dom(best.el)
    .children()
    .filter((_, child) => {
      return dom(child)
        .find("a[href]")
        .toArray()
        .some((anchor) => {
          const href = dom(anchor).attr("href") ?? "";

          try {
            const resolved = new URL(href, url).toString();

            return resolved.startsWith(origin) && resolved !== url;
          } catch {
            return false;
          }
        });
    });

  return {
    listItems,
    itemCount: best.itemCount,
  };
}
