"use client";

import { useQuery } from "@tanstack/react-query";
import { searchCollectionsAction } from "../actions/searchCollectionsAction";

type Params = {
  keyword: string;
  limit: number;
};

export function useSearchCollectionsQuery(params: Params) {
  return useQuery({
    queryKey: ["collections-search", params.keyword],
    queryFn: () => searchCollectionsAction(params),

    enabled: params.keyword.trim().length > 0,

    staleTime: 1000 * 30, // 30초 캐시
  });
}
