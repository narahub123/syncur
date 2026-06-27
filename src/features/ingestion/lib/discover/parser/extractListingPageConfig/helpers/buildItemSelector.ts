import * as cheerio from "cheerio";
import { AnyNode, Element } from "domhandler";
import { getSelector } from "./getSelector";

/**
 * 선택된 컨테이너에서 반복되는 item selector를 생성합니다.
 *
 * - 자식 태그 분포 기반 dominant tag 탐색
 * - 반복 구조를 대표하는 selector 생성
 *
 * @param container 목록 컨테이너
 * @param dom Cheerio DOM
 * @returns item selector 문자열
 */
export function buildItemSelector(
  container: AnyNode,
  dom: cheerio.CheerioAPI,
): string {
  const $ = dom;

  const children = $(container).children();

  const tagCounts: Record<string, number> = {};

  // ── 1. 자식 태그 분포 계산 ─────────────────────────────
  children.each((_, child) => {
    const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
    tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
  });

  // ── 2. 가장 많이 등장한 태그 선택 ──────────────────────
  const dominantTag = Object.entries(tagCounts).sort(
    (a, b) => b[1] - a[1],
  )[0]?.[0];

  if (!dominantTag) {
    return "";
  }

  // ── 3. container selector 생성 ─────────────────────────
  const containerSelector = getSelector(container, $);

  // ── 4. item selector 생성 ──────────────────────────────
  return `${containerSelector} > ${dominantTag}`;
}
