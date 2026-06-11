import { useQuery } from "@tanstack/react-query";
import { fetchAdminFeeds } from "../api/fetchAdminFeeds";
import { QUERY_CONFIG } from "@/shared/constants/query";

/**
 * Feed 목록 Query Hook
 *
 * - react-query layer
 * - cache / pagination state 관리
 */
export function useAdminFeedsQuery(params: {
  search?: string;
  limit?: number;
  page?: number;
}) {
  return useQuery({
    queryKey: ["admin-feeds", params],
    queryFn: () => fetchAdminFeeds(params),

    staleTime: QUERY_CONFIG.STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
