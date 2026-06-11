import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getMyLikesAction } from "../actions/getMyLikesAction";
import { FeedResponse } from "@/features/feeds/dto/feedDto";

type Page = FeedResponse;
type PageParam = string | undefined;

/**
 * 사용자 좋아요 기반 Feed 목록 조회 Hook
 *
 * - subscription 기반 feed scope + like 필터 적용된 데이터 조회
 * - cursor 기반 infinite scroll 지원
 * - feed hook과 동일한 pagination 구조 유지
 */
export function useMyLikes() {
  return useInfiniteQuery<Page, Error, InfiniteData<Page>, string[], PageParam>(
    {
      queryKey: ["my-likes"],

      queryFn: async ({ pageParam }) => {
        const res = await getMyLikesAction(pageParam);

        if (!res.success) {
          throw new Error(res.error);
        }

        return res.data;
      },

      initialPageParam: undefined,

      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? lastPage.nextCursor : undefined,
    },
  );
}
