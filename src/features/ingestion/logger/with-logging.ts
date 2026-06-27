import { normalizeError } from "./normalizeError";
import { IngestionStage, LogContext, Logger } from "./types";

/**
 * ingestion pipeline의 단일 stage 실행을 감싸는 logging wrapper
 *
 * @param fn - 실행할 비동기 함수
 * @param logger - ingestion logger 인스턴스
 * @param stage - ingestion 실행 단계 (STAGE 기반)
 *
 * @returns stage logging이 적용된 wrapper 함수
 */
export function withLogging<A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
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

    // ingestion 단계 시작 로그
    scopedLogger.info("start");

    try {
      // 실제 ingestion 작업 실행
      const result = await fn(...args);

      // 정상 완료 로그
      scopedLogger.info("success");

      return result;
    } catch (err) {
      // 에러 발생 시 표준화 후 로그 기록
      scopedLogger.error("error", {
        error: normalizeError(err),
      });

      throw err;
    }
  };
}
