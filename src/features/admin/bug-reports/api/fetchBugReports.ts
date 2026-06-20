import { getBugReportsAction } from "../actions/getBugReportsAction";
import { BugReportQuery } from "../types/search";

/**
 * BugReport 관리자 목록 조회 Fetcher
 * - Server Action 호출 래퍼
 * - React Query / Infinite Query에서 사용
 */
export async function fetchBugReports(query: BugReportQuery) {
  return await getBugReportsAction(query);
}
