import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/shared/constants/query";
import { fetchAdminNotificationDetail } from "../api/fetchAdminNotificationDetail";

/**
 * Admin Notification Detail Query Hook
 */
export function useAdminNotificationDetailQuery(id: string) {
  return useQuery({
    queryKey: ["admin-notification-detail", id],
    queryFn: () => fetchAdminNotificationDetail(id),

    enabled: !!id,

    staleTime: QUERY_CONFIG.STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
