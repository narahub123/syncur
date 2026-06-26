import * as C from "../constants";

/**
 * URL 패턴과 텍스트 정보를 기반으로 1차 점수를 부여합니다.
 * @param url 분석 대상 URL
 * @param anchorText 링크의 텍스트
 * @returns 점수와 사유가 포함된 객체
 */
export function scoreByUrl(
  url: string,
  anchorText: string,
): { score: number; reason: string[] } {
  const reason: string[] = [];
  let score = 0;

  // 분석을 위해 URL 경로와 앵커 텍스트를 소문자로 변환하여 정규화
  const path = new URL(url).pathname.toLowerCase();
  const text = anchorText.toLowerCase();

  // 1. 키워드 기반 가중치 부여
  // URL 경로나 텍스트에 정의된 목록 관련 키워드(board, news 등)가 있는지 확인
  for (const kw of C.LISTING_PATH_KEYWORDS) {
    if (path.includes(kw) || text.includes(kw)) {
      score += 8;
      reason.push(`키워드 매칭: "${kw}"`);
      break; // 키워드 중복 매칭 방지를 위해 하나만 발견되면 루프 종료
    }
  }

  // 2. 경로 깊이(Depth)에 따른 가중치 부여
  // 슬래시(/)를 기준으로 깊이를 측정하여, 상위 경로에 위치할수록 목록 페이지일 확률이 높다고 판단
  const depth = path.split("/").filter(Boolean).length;
  if (depth === 1) {
    score += 5;
    reason.push("경로 깊이 1단계");
  } else if (depth === 2) {
    score += 4;
    reason.push("경로 깊이 2단계");
  } else if (depth === 3) {
    score += 2;
    reason.push("경로 깊이 3단계");
  }

  // 3. 정적 URL 여부 확인
  // 쿼리스트링(?)이 포함되지 않은 URL은 RESTful한 목록 페이지일 가능성이 높음
  if (!url.includes("?")) {
    score += 3;
    reason.push("쿼리스트링 없음");
  }

  // 4. 상세 페이지 식별 및 페널티 부여
  // 단건 글 페이지로 판단되는 URL 패턴(날짜, id, view 등)이 발견되면 강력한 페널티 부여
  if (C.DETAIL_PAGE_PATTERNS.some((p) => p.test(url))) {
    score -= 15;
    reason.push("단건 페이지 패턴");
  }

  return { score, reason };
}
