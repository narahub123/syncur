import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "@/shared/constants/query";
import { fetchAdminFeedExecutionLogDetail } from "../api/fetchAdminFeedExecutionLogDetail";

/**
 * Admin FeedExecutionLog Detail Query Hook
 *
 * 특징:
 * - executionLogId 기반 유니크 쿼리키 관리
 * - ID가 존재할 때만 활성화(enabled 가드)하여 불필요한 요청 방지
 */
export function useAdminFeedExecutionLogDetailQuery(id: string) {
  return useQuery({
    queryKey: ["admin-feed-execution-log-detail", id],
    queryFn: () => fetchAdminFeedExecutionLogDetail(id),
    enabled: !!id,
    staleTime: QUERY_CONFIG.STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
