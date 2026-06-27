import { LogContext, Logger, LoggerBaseContext, LogLevel } from "./types";

/**
 * ingestion 전 구간에서 사용하는 구조화 Logger 생성기
 *
 * 특징:
 * - traceId 기반 요청 추적
 * - 모든 로그는 JSON 형태로 출력
 * - ingestion pipeline 전체 흐름과 연결됨
 * @param base - logger 생성에 필요한 기본 컨텍스트 (traceId 포함)
 * @returns traceId 기반 구조화 logger 인스턴스
 */
export function createLogger(base: LoggerBaseContext): Logger {
  /**
   * 실제 로그 출력 함수
   *
   * 모든 로그는 다음 구조를 가진다:
   * - timestamp: 로그 발생 시간
   * - level: 로그 레벨
   * - message: 로그 메시지
   * - traceId: ingestion 전체 추적 키
   * - context: 추가 메타데이터
   */
  function write(level: LogLevel, message: string, context?: LogContext) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level,
        message,
        traceId: base.traceId,
        ...context,
      }),
    );
  }

  return {
    /**
     * 디버그 레벨 로그
     * - 개발 / 상세 흐름 확인용
     */
    debug: (msg: string, ctx?: LogContext) => write("DEBUG", msg, ctx),

    /**
     * 일반 정보 로그
     * - ingestion 정상 흐름 기록
     */
    info: (msg: string, ctx?: LogContext) => write("INFO", msg, ctx),

    /**
     * 경고 로그
     * - 비정상 가능성 있지만 흐름 지속 가능
     */
    warn: (msg: string, ctx?: LogContext) => write("WARN", msg, ctx),

    /**
     * 에러 로그
     * - ingestion stage 실패
     * - recovery 또는 fallback 가능
     */
    error: (msg: string, ctx?: LogContext) => write("ERROR", msg, ctx),

    /**
     * FATAL:
     * - ingestion pipeline 전체 실패
     * - retry 불가능
     * - 시스템 중단 수준 오류
     */
    fatal: (msg: string, ctx?: LogContext) => write("FATAL", msg, ctx),
  };
}
