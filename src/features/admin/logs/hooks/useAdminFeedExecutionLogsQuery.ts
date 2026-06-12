import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/shared/constants/query";
import { fetchAdminFeedExecutionLogs } from "../api/fetchAdminFeedExecutionLogs";
import { AdminFeedExecutionLogsQuery } from "../types";

/**
 * Feed Execution Log Query Hook
 *
 * - admin logs pagination state 관리
 * - cache key 기반 query sync
 */
export function useAdminFeedExecutionLogsQuery(
  query: AdminFeedExecutionLogsQuery,
) {
  return useQuery({
    queryKey: ["admin-feed-execution-logs", query],
    queryFn: () => fetchAdminFeedExecutionLogs(query),

    staleTime: QUERY_CONFIG.STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
