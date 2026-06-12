import { NotificationDto } from "../dtos/notificationDto";
import { NotificationLean } from "../types/notification-leans";

/**
 * Notification Lean → DTO 변환
 */
export function toNotificationDto(
  notification: NotificationLean,
): NotificationDto {
  return {
    /**
     * 기본 정보
     */
    _id: notification._id.toString(),
    userId: notification.userId.toString(),

    /**
     * 알림 정보
     */
    target: notification.target,
    type: notification.type,

    title: notification.title,
    message: notification.message,

    /**
     * 상태
     */
    isRead: notification.isRead,

    /**
     * 관련 리소스 정보
     */
    metadata: notification.metadata
      ? {
          feedId: notification.metadata.feedId?.toString(),
          postId: notification.metadata.postId?.toString(),
          siteId: notification.metadata.siteId?.toString(),
          feedExecutionLogId:
            notification.metadata.feedExecutionLogId?.toString(),
        }
      : undefined,

    /**
     * 날짜
     */
    createdAt: notification.createdAt.toISOString(),
    updatedAt: notification.updatedAt.toISOString(),
  };
}

/**
 * Notification Lean 목록 → DTO 목록 변환
 */
export function toNotificationDtos(
  notifications: NotificationLean[],
): NotificationDto[] {
  return notifications.map(toNotificationDto);
}
