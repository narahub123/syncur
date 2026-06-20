"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BugReportQuery } from "../types/search";
import { fetchBugReports } from "../api/fetchBugReports";

type BugReportPaginationParams = BugReportQuery;

/**
 * 관리자 BugReport Pagination Query Hook
 * - page 기반 목록 조회
 * - 테이블 UI 전용
 */
export function useAdminBugReportsQuery(params: BugReportPaginationParams) {
  return useQuery({
    queryKey: ["bugReports", params],

    queryFn: () => fetchBugReports(params),

    placeholderData: keepPreviousData,
  });
}
