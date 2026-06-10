import { useMutation, useQueryClient } from "@tanstack/react-query";
import { replaceBookmarkCollectionAction } from "../actions/replaceBookmarkCollectionAction";

/**
 * 컬렉션 교체 Mutation
 *
 * UX:
 * - 기존 컬렉션 선택
 * - 신규 컬렉션 생성
 * - FeedItem 컬렉션 이동
 */
export function useReplaceBookmarkCollectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: replaceBookmarkCollectionAction,

    onSuccess: () => {
      // 컬렉션 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ["bookmark-collections"],
      });

      // 해당 feedItem 상태 갱신
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
    },
  });
}
