/**
 * 알림 종류
 *
 * NEW_POST
 * - 구독 중인 피드에 신규 게시글이 등록됨
 *
 * RSS_FAILED
 * - RSS 수집 과정에서 실패 발생
 *
 * RSS_CONSECUTIVE_FAILED
 * - 동일 RSS가 연속적으로 실패
 *
 * PARSER_ERROR
 * - RSS 파싱 과정에서 오류 발생
 *
 * SYSTEM
 * - 시스템 공지 및 운영 알림
 */
export const NOTIFICATION_TYPE = {
  NEW_FEED_ITEM: "NEW_FEED_ITEM",

  RSS_FAILED: "RSS_FAILED",
  RSS_CONSECUTIVE_FAILED: "RSS_CONSECUTIVE_FAILED",
  PARSER_ERROR: "PARSER_ERROR",

  SYSTEM: "SYSTEM",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];
