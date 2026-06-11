import { useQuery } from "@tanstack/react-query";
import { fetchAdminFeeds } from "../api/fetchAdminFeeds";
import { QUERY_CONFIG } from "@/shared/constants/query";
import { AdminFeedsQuery } from "../types";

/**
 * Feed 목록 Query Hook
 *
 * - react-query layer
 * - cache / pagination state 관리
 */
export function useAdminFeedsQuery(query: AdminFeedsQuery) {
  return useQuery({
    queryKey: ["admin-feeds", query],
    queryFn: () => fetchAdminFeeds(query),

    staleTime: QUERY_CONFIG.STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
