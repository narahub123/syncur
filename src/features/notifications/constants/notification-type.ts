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
  INQUIRY_REPLIED: "INQUIRY_REPLIED",
  BUG_REPORT_REPLIED: "BUG_REPORT_REPLIED",

  RSS_FAILED: "RSS_FAILED",
  RSS_CONSECUTIVE_FAILED: "RSS_CONSECUTIVE_FAILED",
  PARSER_ERROR: "PARSER_ERROR",

  INQUIRY_CREATED: "INQUIRY_CREATED",
  REPORT_CREATED: "REPORT_CREATED",
  SYSTEM: "SYSTEM",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

/**
 * 알림/권한 관련 상태 정의
 * * @description
 * 브라우저 및 시스템 레벨에서 제공하는 권한 상태값
 */
export const NOTIFICATION_PERMISSION_STATUS = {
  GRANTED: "granted",
  DEFAULT: "default",
  DENIED: "denied",
} as const;

/**
 * PermissionStatus의 타입을 추출
 * (유니온 타입: "granted" | "default" | "denied")
 */
export type NotificationPermissionStatusType =
  (typeof NOTIFICATION_PERMISSION_STATUS)[keyof typeof NOTIFICATION_PERMISSION_STATUS];
