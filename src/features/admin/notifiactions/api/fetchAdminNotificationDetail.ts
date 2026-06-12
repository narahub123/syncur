import { getAdminNotificationDetailAction } from "../actions/getAdminNotificationDetailAction";

/**
 * Notification Detail Fetcher
 */
export const fetchAdminNotificationDetail = async (id: string) => {
  return await getAdminNotificationDetailAction(id);
};
