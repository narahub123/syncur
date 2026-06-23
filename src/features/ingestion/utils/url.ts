import normalizeUrlPackage from "normalize-url";
import validator from "validator";

/**
 * 사용자 입력 URL을 표준 형식으로 정규화하고 유효성을 검사합니다.
 * * @param {string} input - 사용자가 입력한 원본 URL 문자열.
 * @returns {string} 정규화가 완료된 표준 URL 문자열.
 * @throws {Error} URL 형식이 유효하지 않거나 프로토콜(http/https)이 없을 경우 에러를 던집니다.
 * * @example
 * // 성공 시
 * const url = normalizeUrl('HTTP://example.com/blog?utm_source=test/');
 * // 결과: 'http://example.com/blog'
 * * @example
 * // 실패 시
 * normalizeUrl('invalid-url');
 * // 결과: Error: 지원하지 않거나 올바르지 않은 URL 형식입니다.
 */
export function normalizeUrl(input: string): string {
  // 1. 패키지를 통해 정규화
  const normalized = normalizeUrlPackage(input, {
    // URL 뒤의 '#'으로 시작하는 프래그먼트 제거 (예: #section1)
    stripHash: true,

    // 분석 도구에서 사용하는 추적 파라미터(utm_, ref 등)를 제거하여 중복을 방지
    removeQueryParameters: [/^utm_\w+/i, "ref"],

    // URL 마지막의 '/'가 있는 것과 없는 것을 통일 (있을 경우 제거)
    removeTrailingSlash: true,
  });

  // 2. validator를 사용하여 최종 URL의 유효성을 검사합니다.
  // 프로토콜이 반드시 http 또는 https여야 함을 강제합니다.
  // 2. validator를 사용하여 최종 URL의 유효성을 검사합니다.
  if (
    !validator.isURL(normalized, {
      // 웹 수집 시스템이므로 보안 및 데이터 안정성을 위해 http/https 프로토콜만 허용합니다.
      protocols: ["http", "https"],

      // 프로토콜이 생략된 입력(예: example.com)은 혼동을 방지하기 위해 거부하고,
      // 반드시 완전한 형식의 URL을 사용하도록 강제합니다.
      require_protocol: true,
    })
  ) {
    // 유효하지 않은 URL일 경우 에러를 발생시켜 잘못된 데이터가 파이프라인에 진입하는 것을 방지합니다.
    throw new Error(
      `지원하지 않거나 올바르지 않은 URL 형식입니다: ${normalized}`,
    );
  }

  return normalized;
}
