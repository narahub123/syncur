"use client";

import { useQuery } from "@tanstack/react-query";
import { getListingPagesAction } from "../actions/getListingPagesAction";

export function useListingPages(siteId?: string) {
  return useQuery({
    queryKey: ["listing-pages", siteId],
    queryFn: async () => {
      if (!siteId) return [];
      return await getListingPagesAction(siteId);
    },
    enabled: !!siteId,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}
