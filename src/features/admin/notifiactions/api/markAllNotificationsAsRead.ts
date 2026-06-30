import { NotificationTarget } from "@/features/notifications/constants/notification-target";
import { markAllNotificationsAsReadAction } from "../actions/markAllNotificationsAsReadAction";
import { NotificationType } from "@/features/notifications/constants/notification-type";

/**
 * 모든 알림 읽음 처리 API
 */
export const markAllNotificationsAsRead = async (
  target: NotificationTarget,
  types?: NotificationType[],
) => {
  return await markAllNotificationsAsReadAction(target, types);
};
