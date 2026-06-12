/**
 * 알림 수신 대상
 *
 * USER
 * - 일반 사용자에게 전달되는 알림
 *
 * ADMIN
 * - 관리자에게 전달되는 시스템 운영 알림
 */
export const NOTIFICATION_TARGET = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type NotificationTarget =
  (typeof NOTIFICATION_TARGET)[keyof typeof NOTIFICATION_TARGET];
  