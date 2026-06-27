import { INGESTION_STAGE } from "./stages";

/**
 * 로그 레벨 정의
 * ingestion 실행 흐름에서 로그의 중요도를 구분한다.
 */
export type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "FATAL";

/**
 * ingestion 단계 정의 (INGESTION_STAGE 기반)
 * - ingestion pipeline의 각 실행 단계를 표현한다.
 * - 모든 로그는 반드시 이 stage 중 하나와 연결된다.
 */
export type IngestionStage =
  (typeof INGESTION_STAGE)[keyof typeof INGESTION_STAGE];

/**
 * 로그에 추가로 포함되는 컨텍스트 데이터
 *
 * - stage는 포함되지 않는다 (logger 또는 wrapper에서 관리)
 * - 자유로운 key-value 형태의 확장 데이터
 * - error는 표준화된 구조를 따른다
 */
export type LogContext = {
  [key: string]: unknown;

  /**
   * 표준화된 에러 구조
   * ingestion 실패 원인을 구조적으로 기록한다.
   */
  error?: {
    message: string;
    name?: string;
    stack?: string;
    cause?: unknown;
  };
};

/**
 * Logger 인터페이스
 *
 * ingestion 전 구간에서 사용하는 공통 로그 API
 *
 * 특징:
 * - traceId 기반 요청 추적
 * - JSON 구조 로그 출력 전제
 * - stage는 외부에서 주입되는 구조
 */
export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, context?: LogContext): void;
  fatal(message: string, context?: LogContext): void;
}

/**
 * Logger 생성 시 필요한 기본 컨텍스트
 *
 * - traceId: ingestion 전체 흐름을 연결하는 고유 ID
 */
export interface LoggerBaseContext {
  traceId: string;
}
