import { NotificationWithSiteAndFeedExecutionLogDto } from "../dtos/notificationDto";
import { NotificationWithSiteAndFeedExecutionLogLean } from "../types/notification-leans";
import { toNotificationDto } from "./toNotificationDto";

/**
 * NotificationWithSiteAndFeedExecutionLog Lean → DTO 변환
 */
export function toNotificationWithSiteAndFeedExecutionLogDto(
  notification: NotificationWithSiteAndFeedExecutionLogLean,
): NotificationWithSiteAndFeedExecutionLogDto {
  const base = toNotificationDto(notification);

  return {
    ...base,

    site: notification.site
      ? {
          _id: notification.site._id.toString(),
          name: notification.site.name,
          url: notification.site.url,
          faviconUrl: notification.site.favicon_url,
        }
      : null,

    feedExecutionLog: notification.feedExecutionLog
      ? {
          _id: notification.feedExecutionLog._id.toString(),

          executionId: notification.feedExecutionLog.executionId,

          status: notification.feedExecutionLog.status,

          reason: notification.feedExecutionLog.reason,

          failedAtStage: notification.feedExecutionLog.failedAtStage,

          error: notification.feedExecutionLog.error
            ? {
                type: notification.feedExecutionLog.error.type,

                message: notification.feedExecutionLog.error.message,
              }
            : undefined,

          startedAt: notification.feedExecutionLog.startedAt?.toISOString(),

          finishedAt: notification.feedExecutionLog.finishedAt?.toISOString(),

          durationMs: notification.feedExecutionLog.durationMs,
        }
      : null,
  };
}

export const toNotificationWithSiteAndFeedExecutionLogDtoS = (
  items: NotificationWithSiteAndFeedExecutionLogLean[],
): NotificationWithSiteAndFeedExecutionLogDto[] => {
  return items.map(toNotificationWithSiteAndFeedExecutionLogDto);
};
