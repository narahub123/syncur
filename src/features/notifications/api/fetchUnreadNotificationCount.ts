import { getUnreadNotificationCountAction } from "../actions/getUnreadNotificationCountAction";
import { NotificationTarget } from "../constants/notification-target";

/**
 * 읽지 않은 알림 개수 조회
 */
export const fetchUnreadNotificationCount = async (
  target: NotificationTarget,
) => {
  return await getUnreadNotificationCountAction(target);
};
