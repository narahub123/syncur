import { getAdminNotificationsPaginatedAction } from "../actions/getAdminNotificationsPaginatedAction";
import { AdminNotificationsQuery } from "../types";

/**
 * Notification Fetcher
 */
export const fetchAdminNotifications = async (
  query: AdminNotificationsQuery,
) => {
  return await getAdminNotificationsPaginatedAction(query);
};
