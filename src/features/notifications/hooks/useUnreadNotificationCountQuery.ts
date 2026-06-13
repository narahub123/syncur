import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/shared/constants/query";
import { fetchUnreadNotificationCount } from "../api/fetchUnreadNotificationCount";
import { NotificationTarget } from "../constants/notification-target";

/**
 * 읽지 않은 알림 개수 조회
 */
export function useUnreadNotificationCountQuery(target: NotificationTarget) {
  return useQuery({
    queryKey: ["notification-unread-count"],

    queryFn: () => fetchUnreadNotificationCount(target),

    staleTime: QUERY_CONFIG.STALE_TIME,
  });
}
