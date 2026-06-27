import * as cheerio from "cheerio";
import { AnyNode, Element } from "domhandler";

/**
 * 목록 페이지에서 가장 유력한 컨테이너를 찾습니다.
 *
 * - 반복 구조 기반 후보 탐색
 * - 상세 링크 포함 여부 검증
 * - itemCount 기준 최적 컨테이너 선택
 *
 * @param url 분석 대상 URL
 * @param dom Cheerio DOM
 * @returns 최적 컨테이너 또는 null
 */
export function findListingContainer(
  url: string,
  dom: cheerio.CheerioAPI,
): AnyNode | null {
  const $ = dom;
  const origin = new URL(url).origin;

  interface ContainerCandidate {
    el: AnyNode;
    itemCount: number;
  }

  const candidates: ContainerCandidate[] = [];

  // ── 1. 후보 탐색 ─────────────────────────────
  $("*").each((_, el) => {
    const children = $(el).children();
    if (children.length < 3) return;

    // 태그 반복 비율 계산
    const tagCounts: Record<string, number> = {};

    children.each((_, child) => {
      const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    });

    const maxTagCount = Math.max(...Object.values(tagCounts));
    const repeatRatio = maxTagCount / children.length;

    if (repeatRatio < 0.7) return;

    // ── 2. 상세 링크 포함 여부 확인 ─────────────
    const withDetailLinks = children.filter((_, child) => {
      return $(child)
        .find("a[href]")
        .toArray()
        .some((a) => {
          const href = $(a).attr("href") ?? "";
          try {
            const resolved = new URL(href, url).toString();
            return resolved.startsWith(origin) && resolved !== url;
          } catch {
            return false;
          }
        });
    });

    if (withDetailLinks.length >= 3) {
      candidates.push({
        el,
        itemCount: withDetailLinks.length,
      });
    }
  });

  // ── 3. 최적 후보 선택 ─────────────────────────
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => b.itemCount - a.itemCount);

  return candidates[0].el;
}
