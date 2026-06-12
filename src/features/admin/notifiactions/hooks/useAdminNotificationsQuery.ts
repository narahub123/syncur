import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/shared/constants/query";
import { fetchAdminNotifications } from "../api/fetchAdminNotifications";
import { AdminNotificationsQuery } from "../types";

/**
 * Admin Notification Query Hook
 */
export function useAdminNotificationsQuery(query: AdminNotificationsQuery) {
  return useQuery({
    queryKey: ["admin-notifications", query],
    queryFn: () => fetchAdminNotifications(query),

    staleTime: QUERY_CONFIG.STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
