/**
 * RSS item 내부 표준 구조
 *
 * === 역할 ===
 * RSS / Atom은 구조가 다르기 때문에
 * DB 저장 전에 "공통 포맷"으로 통일하기 위한 DTO
 *
 * === 포인트 ===
 * - RSS/Atom 필드명이 다름 (guid/id/link 혼재)
 * - optional 필드 많음
 */
export type RSSItem = {
  guid?: string | null;
  link: string;
  title: string;
  description: string;
  author?: string | null;
  publishedAt?: Date | null;
  categories: string[];
};

/**
 * XML 파서 결과는 구조가 고정되지 않기 때문에
 * 안전하게 접근하기 위한 loose 타입
 *
 * === 이유 ===
 * RSS/Atom XML 구조는 스키마가 존재하지 않는 JSON-like 구조
 */
export type XMLNode = Record<string, unknown>;

export type RSSFailureType =
  | "TEMPORARY" // retry + 누적
  | "PERMANENT" // 즉시 중단/disabled 후보
  | "PARSE"; // 데이터 문제

export const INGESTION_RESULT = {
  SUCCESS: "success",
  ERROR: "error",
  PARSE_ERROR: "parse_error",
  SKIPPED_DISABLED: "skipped_disabled",
  DISABLED_TRIGGERED: "disabled_triggered",
  SKIPPED_CACHE: "skipped_cache",
} as const;

export type IngestionResult =
  (typeof INGESTION_RESULT)[keyof typeof INGESTION_RESULT];
