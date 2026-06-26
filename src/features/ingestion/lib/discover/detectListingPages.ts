import * as cheerio from "cheerio";
import { scoreByContent } from "./analyzer/scoreByContent";
import { scoreByUrl } from "./analyzer/scoreByUrl";
import { NOISE_SELECTORS } from "./constants";
import { getBaseUrl, isSameDomain, resolveUrl } from "./utils";
import { ListingDetectionResult, ListingPageCandidate } from "./types";
import { extractListingPageConfig } from "./parser/extractListingPageConfig";
import { extractDetailPageConfig } from "./parser/extractDetailPageConfig";
import { testDetailPageConfig } from "@/scripts/testDetailPageConfig";

/**
 * 사이트 홈 페이지를 분석하여 목록 페이지 후보를 감지합니다.
 * @param homeUrl 사이트 메인 URL
 * @param dom 홈 페이지의 Cheerio 객체
 * @param headers HTTP 요청 헤더
 * @param maxProbe 검증할 후보 최대 개수
 * @returns 탐지 결과 객체
 */
export async function detectListingPages(
  homeUrl: string,
  dom: cheerio.CheerioAPI,
  headers: Record<string, string> = {},
  maxProbe = 10,
): Promise<ListingDetectionResult> {
  const base = getBaseUrl(homeUrl);
  const $home = dom;

  // ── 1단계: 노이즈 링크 수집 ─────────────────────────────
  const noiseSet = new Set<string>();
  NOISE_SELECTORS.forEach((sel) => {
    $home(sel).each((_, el) => {
      const href = $home(el).attr("href");
      const resolved = resolveUrl(href ?? "", base);
      if (resolved) noiseSet.add(resolved);
    });
  });

  // ── 2단계: 내부 링크 전체 수집 ──────────────────────────
  const linkMap = new Map<string, string>(); // url → anchorText
  $home("a[href]").each((_, el) => {
    const href = $home(el).attr("href") ?? "";
    const resolved = resolveUrl(href, homeUrl);
    if (!resolved) return;
    if (!isSameDomain(resolved, homeUrl)) return;
    if (resolved === homeUrl || resolved === base || resolved === base + "/")
      return;
    if (noiseSet.has(resolved)) return;
    if (!linkMap.has(resolved)) {
      linkMap.set(resolved, $home(el).text().trim());
    }
  });

  // ── 3단계: URL 패턴으로 1차 점수 ────────────────────────
  // 허들을 낮춰서 점수 > 0 이면 전부 후보로 올림
  const scored: ListingPageCandidate[] = [];
  for (const [url, text] of linkMap.entries()) {
    const { score, reason } = scoreByUrl(url, text);
    if (score > 0) {
      scored.push({
        url,
        title: text || url,
        lastUpdated: null,
        score,
        reason,
        listingPageConfig: null,
        detailPageConfig: null,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  // ── 4단계: 상위 후보 fetch 검증 ─────────────────────────
  // maxProbe를 넉넉하게 잡아서 키워드 미매칭 URL도 검증 기회를 줌
  const probeTargets = scored.slice(0, maxProbe);
  await Promise.all(
    probeTargets.map(async (c) => {
      const { score, reason, title, lastUpdated, dom } = await scoreByContent(
        c.url,
        headers,
      );
      c.score += score;
      c.reason.push(...reason);
      if (title) c.title = title;
      c.lastUpdated = lastUpdated;

      // ── 5단계: MIN_SCORE 통과 시 ListingPageConfig 추출 ────────
      if (c.score >= 20 && dom) {
        const result = extractListingPageConfig(c.url, dom);
        if (result) {
          const { firstItemUrl, ...listingConfig } = result;
          c.listingPageConfig = listingConfig;

          // ── 6단계: 상세 페이지 config 추출 ──────────────────
          if (firstItemUrl) {
            try {
              const detailRes = await fetch(firstItemUrl, {
                headers,
                signal: AbortSignal.timeout(6000),
              });
              if (detailRes.ok) {
                const detailHtml = await detailRes.text();
                const detailDom = cheerio.load(detailHtml);
                c.detailPageConfig = extractDetailPageConfig(
                  firstItemUrl,
                  detailDom,
                );

                // 추출 결과 확인
                if (c.detailPageConfig) {
                  const result = await testDetailPageConfig(
                    firstItemUrl,
                    c.detailPageConfig,
                    headers,
                  );
                  console.log("detailPageConfig 추출 결과", result);
                }
              }
            } catch {
              // fetch 실패 무시
            }
          }
        }
      }
    }),
  );

  // ── 5단계: 최종 정렬 및 필터 ────────────────────────────
  // scoreByContent에서 반복 구조(20)가 확인된 것만 유의미하므로
  // 최소 점수를 20로 설정
  const MIN_SCORE = 20;
  const final = probeTargets
    .filter((c) => c.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  console.log("결과", final);
  return { candidates: final, fromCache: false };
}
