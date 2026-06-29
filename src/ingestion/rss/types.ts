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

import { FeedItemInput } from "@/features/feed-sample/types";

/** @deprecated FeedItemInput을 사용하세요 */
export type RSSItem = FeedItemInput;

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

/**
 * RSS Fetch attempt 단위 관측 데이터
 *
 * === 역할 ===
 * - 각 retry 시도에서 어떤 일이 일어났는지 기록
 * - 운영 분석 / 장애 원인 추적용
 */
export type RSSFetchAttemptLog = {
  attempt: number;
  startTime: number;
  endTime: number;
  durationMs: number;

  feedUrl: string;

  success: boolean;

  errorCode?: string;
  errorMessage?: string;

  phase?: "dns" | "tcp" | "tls" | "request" | "response" | "unknown";
};
