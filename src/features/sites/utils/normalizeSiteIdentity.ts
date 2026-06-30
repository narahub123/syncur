/**
 * Site identity 기준 생성 함수
 *
 * 동일한 사이트인지 비교하기 위한 정규화된 문자열을 생성한다.
 *
 * @description
 * - DB에서 Site 중복 판단 및 조회 키로 사용
 * - URL을 "표시용"이 아니라 "비교용"으로 변환
 * - input normalize (UX용)와는 목적이 완전히 다름
 *
 * @rules
 * - protocol(http/https) 제거
 * - www 제거
 * - trailing slash 제거
 * - lowercase 변환
 *
 * @example
 * https://www.Example.com/  → example.com
 */
export function normalizeSiteIdentity(url: string) {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}
