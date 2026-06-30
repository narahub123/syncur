import normalizeUrlPackage from "normalize-url";
import validator from "validator";
import { z } from "zod";

/**
 * URL 검증을 위한 Zod 스키마 정의
 * 1. 문자열 여부 확인
 * 2. 문자열 개수 확인
 */
const urlSchema = z.string().trim().min(1, "주소를 입력해 주세요.");

/**
 * 사용자 입력 URL을 검증 후 표준 형식으로 정규화합니다.
 * @param {string} input - 사용자가 입력한 원본 URL 문자열.
 * @param logger - ingestion logger
 * @returns {string} 정규화가 완료된 표준 URL 문자열.
 * @throws {Error} URL 형식이 유효하지 않거나 프로토콜(http/https)이 없을 경우 에러를 던집니다.
 */
export function normalizeUrl(input: string): string {
  // 1. [사전 처리] 프로토콜이 없는 경우 자동으로 붙여줍니다.
  let urlToValidate = input;
  if (!/^https?:\/\//i.test(urlToValidate)) {
    urlToValidate = `https://${urlToValidate}`;
  }

  // 2. [검증 단계] 이제 프로토콜이 강제된 상태에서 검증합니다.
  const validation = urlSchema.safeParse(urlToValidate);
  if (!validation.success) {
    throw new Error("올바른 주소 형식이 아닙니다.");
  }

  // 3. [정규화 단계] 검증이 완료된 URL만 안전하게 정규화합니다.
  // normalize-url은 기본적으로 protocol이 없으면 http를 붙이지만,
  // 우리는 이미 위에서 https를 붙였으므로 이를 표준화하는 역할만 수행합니다
  const normalized = normalizeUrlPackage(validation.data, {
    // URL 뒤의 '#'으로 시작하는 프래그먼트 제거 (예: #section1)
    stripHash: true,

    // 분석 도구에서 사용하는 추적 파라미터(utm_, ref 등)를 제거하여 중복을 방지
    removeQueryParameters: [/^utm_\w+/i, "ref"],

    // URL 마지막의 '/'가 있는 것과 없는 것을 통일 (있을 경우 제거)
    removeTrailingSlash: true,
  });

  // 4. [최종 유효성 확인] validator로 문법적 정확성 최종 체크
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
    throw new Error(`지원하지 않거나 올바르지 않은 URL 형식입니다`);
  }

  return normalized;
}
