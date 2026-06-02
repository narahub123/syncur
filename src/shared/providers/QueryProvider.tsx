"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { QUERY_CONFIG } from "../constants/query";

type QueryProviderProps = {
  children: React.ReactNode;
};

/**
 * TanStack Query Provider.
 *
 * 역할:
 * - QueryClient를 애플리케이션 전체에 제공한다.
 * - 서버 상태 캐싱을 관리한다.
 * - React Query Devtools를 연결한다.
 */
export default function QueryProvider({ children }: QueryProviderProps) {
  /**
   * QueryClient는 한 번만 생성해야 한다.
   *
   * 컴포넌트가 리렌더링될 때마다
   * 새로운 QueryClient가 생성되는 것을 방지한다.
   */
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            /**
             * 데이터를 1분 동안 fresh 상태로 유지한다.
             */
            staleTime: QUERY_CONFIG.STALE_TIME,

            /**
             * 브라우저 탭 복귀 시
             * 자동 재조회하지 않는다.
             */
            refetchOnWindowFocus: false,

            /**
             * 요청 실패 시 재시도 횟수.
             */
            retry: QUERY_CONFIG.RETRY_COUNT,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* TanStack Query 캐시 상태 확인용 개발 도구 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
