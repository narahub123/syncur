import { NotificationTarget } from "@/features/notifications/constants/notification-target";
import { markAllNotificationsAsReadAction } from "../actions/markAllNotificationsAsReadAction";

/**
 * 모든 알림 읽음 처리 API
 */
export const markAllNotificationsAsRead = async (
  target: NotificationTarget,
) => {
  return await markAllNotificationsAsReadAction(target);
};
