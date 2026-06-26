import * as cheerio from "cheerio";
import type { AnyNode } from "domhandler";
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
    // 페이지 데이터를 가져오기 위한 HTTP 요청 (6초 타임아웃 적용)
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return { score, reason, title, lastUpdated };

    const html = await res.text();
    const $ = cheerio.load(html);

    // ── 0. 페이지 title 추출 ────────────────────────────────
    // 페이지 식별을 위해 <title> 태그나 첫 번째 <h1> 헤딩에서 제목 추출
    title =
      $("title").first().text().trim() || $("h1").first().text().trim() || null;

    // ── 1. 반복 구조 탐지 ───────────────────────────────────
    // 게시물 목록은 주로 ul, ol, table 등 동일한 요소가 반복되는 구조를 가짐
    const containerSelectors = [
      "ul",
      "ol",
      "table tbody",
      "[class*='list']",
      "[class*='board']",
      "[class*='post']",
      "[class*='item']",
      "[class*='entry']",
    ];

    let listItems: cheerio.Cheerio<AnyNode> | null = null;

    for (const sel of containerSelectors) {
      let bestContainer: cheerio.Cheerio<AnyNode> | null = null;
      let bestCount = 0;

      // 지정된 선택자 중 자식 요소가 가장 많은 컨테이너 탐색
      $(sel).each((_, el) => {
        const count = $(el).children().length;
        if (count > bestCount) {
          bestCount = count;
          bestContainer = $(el);
        }
      });

      if (!bestContainer || bestCount < 3) continue;

      // 컨테이너 내부 항목들이 상세 페이지로 연결되는 링크를 포함하는지 확인
      const origin = new URL(url).origin;
      const withDetailLinks = (bestContainer as cheerio.Cheerio<AnyNode>)
        .children()
        .filter((_, el) => {
          return $(el)
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

      // 상세 링크를 가진 항목이 3개 이상이면 목록 컨테이너로 인정
      if (withDetailLinks.length >= 3) {
        listItems = withDetailLinks;
        score += 15;
        reason.push(
          `반복 구조 발견 (${sel}, ${withDetailLinks.length}개 항목)`,
        );
        break;
      }
    }

    // 반복 구조가 확인되지 않으면 목록 페이지가 아닐 가능성이 높으므로 종료
    if (!listItems) return { score, reason, title, lastUpdated };

    // ── 2. 항목별 날짜 다양성 + lastUpdated ─────────────────
    // 목록 항목 내 날짜 패턴을 추출하여 게시물의 최신성을 확인
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
        // 가장 최근 날짜 — 문자열 정렬로 max 추출 (yyyy-mm-dd 정규화)
        lastUpdated =
          datesPerItem
            .map((d) => d.replace(/[./]/g, "-"))
            .sort()
            .at(-1) ?? null;
      } else {
        // 날짜가 모두 동일하면 정적 페이지일 확률이 높아 감점
        score -= 5;
        reason.push("날짜 모두 동일 (정적 데이터 의심)");
      }
    }

    // ── 3. 작성자 정보 반복 ─────────────────────────────────
    // 항목마다 작성자 관련 선택자가 존재하는지 확인하여 게시판 신뢰도 파악
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

    // ── 4. 페이지네이션 ─────────────────────────────────────
    // 페이지 이동 버튼 존재 여부를 통해 목록이 다수 페이지로 나뉘어 있음을 확인
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
    // 네트워크 오류 등으로 인한 fetch 실패 시 빈 결과를 반환하여 처리
  }

  return { score, reason, title, lastUpdated };
}
