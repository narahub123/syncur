import * as cheerio from "cheerio";
import type { AnyNode, Element } from "domhandler";
import { AUTHOR_SELECTORS, DATE_PATTERN } from "../constants";

/**
 * 실제 페이지 내용을 fetch하여 상세 분석 후 점수를 업데이트합니다.
 * @param url 분석 대상 URL
 * @param headers 요청 시 사용할 헤더
 * @returns 점수와 사유가 포함된 객체
 */
export async function scoreByContent(
  url: string,
  headers: Record<string, string>,
): Promise<{
  score: number;
  reason: string[];
  title: string | null;
  lastUpdated: string | null;
}> {
  const reason: string[] = [];
  let score = 0;
  let title: string | null = null;
  let lastUpdated: string | null = null;

  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { score, reason, title, lastUpdated };

    const html = await res.text();
    const $ = cheerio.load(html);

    // ── 0. 페이지 title 추출: 메타 태그 또는 h1 태그 활용 ────────────────
    title =
      $("title").first().text().trim() || $("h1").first().text().trim() || null;

    // ── 1. 노이즈 영역 제거: 탐색 방해 요소(내비게이션, 광고 등)를 DOM에서 삭제 ──
    const NOISE_REMOVE_SELECTORS = [
      "nav",
      "header",
      "footer",
      "[class*='nav']",
      "[class*='menu']",
      "[class*='banner']",
      "[class*='ad']",
      "[class*='cookie']",
      "[class*='popup']",
    ];
    NOISE_REMOVE_SELECTORS.forEach((sel) => $(sel).remove());

    // ── 2. 구조 기반 반복 구조 탐지 ──────────────────────────────────────────
    // CSS 셀렉터 대신 DOM의 자식 태그 비율과 구조적 반복성을 직접 분석
    const EXCLUDE_CONTAINER_SELECTORS = [
      "[class*='tag']",
      "[class*='label']",
      "[class*='social']",
      "[class*='share']",
      "[class*='breadcrumb']",
      "[class*='tab']",
      "[class*='dropdown']",
    ];

    const origin = new URL(url).origin;

    interface ContainerCandidate {
      el: AnyNode;
      itemCount: number;
    }

    const candidates: ContainerCandidate[] = [];

    // 페이지 내 모든 노드를 순회하며 잠재적인 목록 컨테이너 탐색
    $("*").each((_, el) => {
      const isExcluded = EXCLUDE_CONTAINER_SELECTORS.some(
        (excSel) => $(el).is(excSel) || $(el).closest(excSel).length > 0,
      );
      if (isExcluded) return;

      const children = $(el).children();
      if (children.length < 3) return; // 항목이 3개 미만이면 목록으로 보지 않음

      // 자식 태그들의 타입을 분석하여 반복 구조 여부(70% 이상 동질성) 판단
      const tagCounts: Record<string, number> = {};
      children.each((_, child) => {
        const tag = (child as Element).tagName?.toLowerCase() ?? "unknown";
        tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
      });

      const maxTagCount = Math.max(...Object.values(tagCounts));
      const repeatRatio = maxTagCount / children.length;
      if (repeatRatio < 0.7) return;

      // 자식 요소들이 실제 도메인 내의 상세 페이지 링크를 포함하는지 검증
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
        candidates.push({ el, itemCount: withDetailLinks.length });
      }
    });

    // 가장 많은 항목을 가진 컨테이너를 최종 후보로 선택
    candidates.sort((a, b) => b.itemCount - a.itemCount);
    const best = candidates[0] ?? null;
    let listItems: cheerio.Cheerio<AnyNode> | null = null;

    if (best) {
      listItems = $(best.el)
        .children()
        .filter((_, child) => {
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
      score += 15;
      reason.push(`반복 구조 발견 (${best.itemCount}개 항목)`);
    }

    if (!listItems) return { score, reason, title, lastUpdated };

    // ── 2.5단계: 다수결 투표 기반의 계층 관계 분석 ──────────────────────────
    // 현재 페이지 경로와 목록 내 링크들의 경로를 비교하여 부모/자식 관계 판정
    const currentPath = new URL(url).pathname.split("/").filter(Boolean);
    const candidateLinks = new Set<string>(); // 중복 투표 방지를 위해 Set 사용

    listItems.each((_, el) => {
      $(el)
        .find("a[href]")
        .each((_, a) => {
          const href = $(a).attr("href");
          if (!href) return;
          try {
            const fullUrl = new URL(href, url).toString();
            if (fullUrl.startsWith(origin) && fullUrl !== url) {
              candidateLinks.add(fullUrl);
            }
          } catch {}
        });
    });

    if (candidateLinks.size > 0) {
      let parentCount = 0;
      let siblingCount = 0;

      for (const link of candidateLinks) {
        try {
          const linkPath = new URL(link).pathname.split("/").filter(Boolean);
          // 공통 경로(Prefix)를 찾아 의미 있는 관계인지 확인
          let commonDepth = 0;
          const minLen = Math.min(currentPath.length, linkPath.length);
          while (
            commonDepth < minLen &&
            currentPath[commonDepth] === linkPath[commonDepth]
          ) {
            commonDepth++;
          }

          if (commonDepth >= 1) {
            if (linkPath.length > currentPath.length) parentCount++;
            else if (linkPath.length === currentPath.length) siblingCount++;
          }
        } catch {}
      }

      // 70% 이상의 비율로 승리한 관계를 최종 판정 (최소 3개 이상의 샘플 필요)
      const total = parentCount + siblingCount;
      if (total >= 3) {
        const parentRatio = parentCount / total;
        const siblingRatio = siblingCount / total;

        if (parentRatio >= 0.7) {
          score += 20;
          reason.push(
            `Parent-Child 관계 승리 (${(parentRatio * 100).toFixed(0)}%)`,
          );
        } else if (siblingRatio >= 0.7) {
          if (!url.includes("?page=") && !url.includes("?p=")) {
            score -= 30;
            reason.push(
              `Sibling 관계 승리 (${(siblingRatio * 100).toFixed(0)}%): 상세 페이지 내 부가 목록 의심`,
            );
          }
        }
      }
    }

    // ── 3. 추가 신뢰도 점수 산정 (날짜, 작성자, 페이지네이션) ─────────────────
    // 날짜 다양성 체크
    const datesPerItem: string[] = [];
    listItems.each((_, el) => {
      const matches = $(el).text().match(DATE_PATTERN);
      if (matches) datesPerItem.push(matches[0]);
    });

    if (datesPerItem.length >= 3) {
      const uniqueDates = new Set(datesPerItem);
      if (uniqueDates.size >= 2) {
        score += 20;
        reason.push(`다양한 날짜 발견 (${uniqueDates.size}종류)`);
        lastUpdated =
          datesPerItem
            .map((d) => d.replace(/[./]/g, "-"))
            .sort()
            .at(-1) ?? null;
      } else {
        score -= 5;
        reason.push("날짜 모두 동일 (정적 데이터 의심)");
      }
    }

    // 작성자 정보 반복 체크
    let authorHitCount = 0;
    for (const sel of AUTHOR_SELECTORS) {
      listItems.each((_, el) => {
        if ($(el).find(sel).length > 0) authorHitCount++;
      });
      if (authorHitCount >= 3) break;
    }
    if (authorHitCount >= 3) {
      score += 10;
      reason.push(`작성자 정보 반복 (${authorHitCount}개 항목)`);
    }

    // 페이지네이션 존재 여부 체크
    const hasPagination =
      $("[class*='pag']").length > 0 ||
      $("a[href*='page=']").length > 0 ||
      $("a[href*='p=']").length > 0 ||
      $(".next, .prev, [rel='next'], [rel='prev']").length > 0;
    if (hasPagination) {
      score += 15;
      reason.push("페이지네이션 존재");
    }
  } catch {
    /* fetch 실패 등 예외는 무시 */
  }

  return { score, reason, title, lastUpdated };
}
