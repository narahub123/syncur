/**
 * unknown 형태의 에러를 구조화된 로그 형태로 변환한다.
 *
 * ingestion 로그 시스템에서 모든 error는 이 함수를 통해
 * 동일한 구조로 표준화된다.
 *
 * - Error 객체 → message / name / stack 포함
 * - 비 Error 값 → 문자열로 변환하여 message로 저장
 *
 * @param err - throw 된 unknown 에러 값
 * @returns 로그에 사용 가능한 표준화된 error 객체
 */
export function normalizeError(err: unknown) {
  // 표준 Error 객체인 경우 상세 정보 유지
  if (err instanceof Error) {
    return {
      message: err.message,
      name: err.name,
      stack: err.stack,
    };
  }

  // Error 객체가 아닌 경우 안전하게 문자열로 변환
  return {
    message: String(err),
  };
}
