"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStatsAction } from "../actions/getDashboardStatsAction";

export function useDashboardStatsQuery() {
  return useQuery({
    queryKey: ["admin", "dashboard", "stats"],

    queryFn: () => getDashboardStatsAction(),

    // 대시보드 진입 시 항상 최신 데이터를 불러오도록 설정
    refetchOnWindowFocus: true,
  });
}
