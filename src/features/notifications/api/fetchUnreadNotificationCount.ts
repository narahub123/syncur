import { getUnreadNotificationCountAction } from "../actions/getUnreadNotificationCountAction";
import { NotificationTarget } from "../constants/notification-target";
import { NotificationType } from "../constants/notification-type";

/**
 * 읽지 않은 알림 개수 조회
 */
export const fetchUnreadNotificationCount = async (
  target: NotificationTarget,
  types?: NotificationType[],
) => {
  return await getUnreadNotificationCountAction(target, types);
};
