import { normalizeError } from "./normalizeError";
import { INGESTION_STAGE_LABEL } from "./stages";
import { IngestionStage, LogContext, Logger } from "./types";

/**
 * ingestion pipeline의 단일 stage 실행을 감싸는 logging wrapper
 *
 * @param fn - 실행할 함수 (동기/비동기 모두 지원)
 * @param logger - ingestion logger 인스턴스
 * @param stage - ingestion 실행 단계 (INGESTION_STAGE 기반)
 *
 * @returns stage logging이 적용된 wrapper 함수
 */
export function withLogging<A extends unknown[], R>(
  fn: (...args: A) => R | Promise<R>,
  logger: Logger,
  stage: IngestionStage,
): (...args: A) => Promise<R> {
  return async (...args: A): Promise<R> => {
    /**
     * stage를 자동 주입하는 scoped logger 생성
     * - 모든 로그에 stage가 자동 포함됨
     */
    const scopedLogger = {
      info: (msg: string, ctx?: LogContext) =>
        logger.info(msg, { stage, ...ctx }),

      debug: (msg: string, ctx?: LogContext) =>
        logger.debug(msg, { stage, ...ctx }),

      warn: (msg: string, ctx?: LogContext) =>
        logger.warn(msg, { stage, ...ctx }),

      error: (msg: string, ctx?: LogContext) =>
        logger.error(msg, { stage, ...ctx }),
    };

    /**
     * stage 실행 시작 시각 기록
     * - stage 전체 실행 시간을 측정하기 위해 사용
     * - durationMs 계산의 기준 시각
     */
    const startedAt = performance.now();

    // ingestion 단계 시작 로그
    scopedLogger.info("시작", { stage: INGESTION_STAGE_LABEL[stage] });

    try {
      // 실제 ingestion 작업 실행
      const result = await fn(...args);

      /**
       * stage 실행 시간(ms) 계산
       * - 시작부터 정상 종료까지의 경과 시간
       */
      const durationMs = performance.now() - startedAt;

      // 정상 완료 로그
      scopedLogger.info("성공", {
        stage: INGESTION_STAGE_LABEL[stage],
        durationMs,
      });

      return result;
    } catch (err) {
      /**
       * 실패한 경우에도 stage 실행 시간을 기록
       * - 어느 시점에서 실패했는지 분석하는 데 사용
       */
      const durationMs = performance.now() - startedAt;

      // 에러 발생 시 표준화 후 로그 기록
      scopedLogger.error("에러", {
        stage: INGESTION_STAGE_LABEL[stage],
        durationMs,
        error: normalizeError(err),
      });

      throw err;
    }
  };
}
