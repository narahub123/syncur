import {
  useInfiniteQuery,
  InfiniteData,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";

/**
 * 페이지 응답 (API 기준)
 *
 * ⚠️ items는 반드시 "단일 아이템 타입"이어야 한다
 */
export type InfinitePageResponse<TItem, S = unknown> = {
  items: TItem[];
  pagination: {
    page: number;
    totalPages: number;
  };
  stats?: S;
};

/**
 * Infinite Query Factory
 *
 * 역할:
 * - page 기반 API → React Query infinite로 변환
 */
export function createInfiniteQuery<
  Q extends Record<string, unknown>,
  TItem,
  S = unknown,
>(
  queryKeyPrefix: string,
  fetcher: (
    query: Q & { page: number },
  ) => Promise<InfinitePageResponse<TItem, S>>,
) {
  return (
    baseQuery: Q,
  ): UseInfiniteQueryResult<
    InfiniteData<InfinitePageResponse<TItem, S>>,
    Error
  > =>
    useInfiniteQuery({
      queryKey: [queryKeyPrefix, baseQuery],

      queryFn: ({ pageParam = 1 }) =>
        fetcher({
          ...baseQuery,
          page: pageParam as number,
        }),

      initialPageParam: 1,

      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
    });
}
