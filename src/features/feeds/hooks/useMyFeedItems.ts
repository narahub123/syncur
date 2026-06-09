import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getMyFeedItemsAction } from "../actions/getMyFeedItemsAction";
import { FeedResponse } from "../dto/feedDto";

type Page = FeedResponse; // React Query가 한 번의 요청에서 받는 "페이지 단위 데이터 구조"
type PageParam = string | undefined; // cursor 값 (없으면 undefined = 첫 페이지)

export function useMyFeedItems() {
  return useInfiniteQuery<
    Page, // 개별 페이지 데이터 타입
    Error, // 에러 타입
    InfiniteData<Page>, // React Query가 내부적으로 누적하는 전체 데이터 구조 (pages 포함)
    string[], // queryKey 타입
    PageParam // cursor(pageParam) 타입
  >({
    queryKey: ["my-feed-items"],

    /**
     * 실제 데이터 요청 함수
     * - pageParam은 cursor 역할
     * - undefined이면 첫 페이지 요청
     */
    queryFn: async ({ pageParam }) => {
      const res = await getMyFeedItemsAction(pageParam);

      // 서버 실패 처리
      if (!res.success) {
        throw new Error(res.error);
      }

      // React Query에는 "payload(data)"만 반환
      return res.data;
    },

    // 최초 요청 시 cursor 값 (첫 페이지)
    initialPageParam: undefined,

    /**
     * 다음 페이지 cursor 계산
     * - hasNext가 true면 nextCursor 반환 → 다음 fetchNextPage에서 사용됨
     * - false면 undefined → infinite query 종료
     */
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
  });
}
