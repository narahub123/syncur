/**
 * ingestion 요청을 식별하기 위한 traceId를 생성한다.
 *
 * - 하나의 ingestion 흐름 전체를 추적하는 고유 키
 * - logger의 모든 로그는 이 traceId로 연결된다
 * - 디버깅 및 분산 추적의 기준 값
 *
 * @returns UUID 기반의 traceId 문자열
 */
export function createTraceId(): string {
  return crypto.randomUUID();
}
