import { useMemo } from "react";
import { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

/**
 * Pagination Response (API)
 */
export type PaginationResponse<T, S = unknown> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
  stats?: S;
};

/**
 * Pagination hook result
 */
export type PaginationQueryResult<T, S = unknown> = {
  data?: PaginationResponse<T, S>;
  isLoading: boolean;
};

/**
 * Infinite page (UI layer)
 */
export type InfinitePage<T, S = unknown> = {
  items: T[];
  stats?: S;
};

/**
 * Infinite result
 */
export type InfiniteResult<T, S = unknown> = UseInfiniteQueryResult<
  InfiniteData<InfinitePage<T, S>>,
  Error
>;

type Params<Q, T, S> = {
  isMobile: boolean;
  query: Q;

  useQueryHook: (query: Q) => PaginationQueryResult<T, S>;

  useInfiniteHook: (query: Q) => InfiniteResult<T, S>;
};

/**
 * 리스트 모드 분기 hook
 */
export function useListMode<Q, T, S>({
  isMobile,
  query,
  useQueryHook,
  useInfiniteHook,
}: Params<Q, T, S>) {
  const pagination = useQueryHook(query);
  const infinite = useInfiniteHook(query);

  /**
   * items 추출
   */
  const items = useMemo((): T[] => {
    if (!isMobile) {
      return pagination.data?.items ?? [];
    }

    return infinite.data?.pages.flatMap((p) => p.items) ?? [];
  }, [isMobile, pagination.data, infinite.data]);

  /**
   * stats 추출
   */
  const stats = useMemo((): S | null => {
    if (!isMobile) {
      return pagination.data?.stats ?? null;
    }

    return infinite.data?.pages?.[0]?.stats ?? null;
  }, [isMobile, pagination.data, infinite.data]);

  /**
   * 모바일 (infinite)
   */
  if (isMobile) {
    return {
      mode: "infinite" as const,
      items,
      stats,

      fetchNextPage: infinite.fetchNextPage,
      hasNextPage: infinite.hasNextPage,
      isLoading: infinite.isLoading,
      isFetchingNextPage: infinite.isFetchingNextPage,
    };
  }

  /**
   * 데스크탑 (pagination)
   */
  return {
    mode: "pagination" as const,
    items,
    stats,

    pagination: pagination.data?.pagination ?? null,
    isLoading: pagination.isLoading,
  };
}
