/**
 * URL 처리 및 도메인 검증을 위한 유틸리티 함수들을 제공합니다.
 */

/**
 * URL 문자열에서 프로토콜과 호스트를 포함한 베이스 URL을 추출합니다.
 * @param url 분석할 전체 URL
 * @returns 베이스 URL 문자열
 */
export function getBaseUrl(url: string): string {
  const u = new URL(url);
  return `${u.protocol}//${u.host}`;
}

/**
 * 상대 경로 href를 절대 경로로 변환합니다. 변환 불가능하거나 제외 대상이면 null을 반환합니다.
 * @param href 링크 경로
 * @param base 기준 URL
 * @returns 절대 경로 URL 또는 null
 */
export function resolveUrl(href: string, base: string): string | null {
  try {
    // 1. [필터링 단계] 수집 가치가 없거나 링크로 동작하지 않는 케이스 제거
    if (
      !href || // 빈 문자열 제거
      href.startsWith("#") || // 페이지 내부 이동(앵커) 제거
      href.startsWith("mailto:") || // 이메일 프로토콜 제거
      href.startsWith("javascript:") // 스크립트 실행 링크 제거
    ) {
      return null;
    }

    // 2. [변환 단계] URL 객체를 생성하여 base 기준의 절대 경로를 산출
    // new URL(href, base)는 base가 절대 경로일 경우 href를 상대 경로로 인식하여 합쳐줍니다.
    return new URL(href, base).toString();
  } catch {
    // 3. [오류 처리] 파싱 중 URL 형식이 잘못되어 발생하는 에러를 포착
    // 유효한 URL로 생성할 수 없는 경우 안전하게 null을 반환하여 파이프라인 중단을 방지
    return null;
  }
}

/**
 * URL이 기준 도메인과 일치하는지 확인합니다.
 * @param url 검증할 URL
 * @param base 비교 기준 도메인
 * @returns 도메인 일치 여부 (boolean)
 */
export function isSameDomain(url: string, base: string): boolean {
  try {
    return new URL(url).host === new URL(base).host;
  } catch {
    return false;
  }
}
