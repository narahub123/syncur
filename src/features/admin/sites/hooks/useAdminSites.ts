"use client";

import { AdminSiteQuery } from "@/features/admin/sites/types/search";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSitesAction } from "../actions/getSitesAction";

export const useAdminSites = (query: AdminSiteQuery) => {
  return useQuery({
    queryKey: ["admin-sites", query],
    queryFn: async () => {
      const result = await getSitesAction(query);

      // 에러 처리
      if ("error" in result && result.error) {
        toast.error(result.error || "목록을 불러오는 데 실패했습니다.");
        throw new Error(result.error);
      }

      // 성공 처리 (목록 조회는 자주 호출되므로 토스트를 띄우지 않거나,
      // 특정 조건에서만 띄우는 것이 좋습니다)
      return result;
    },
  });
};
