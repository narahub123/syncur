import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCollectionAndAttachFeedItemAction } from "../actions/createCollectionAndAttachFeedItemAction";

/**
 * 컬렉션 생성 + FeedItem 저장 mutation
 *
 * UX:
 * - 신규 컬렉션 생성
 * - 기존 컬렉션 reuse
 * - 항상 FeedItem ↔ Collection 연결
 */
export function useCreateCollectionAndAttachMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCollectionAndAttachFeedItemAction,

    onSuccess: (_, variables) => {
      // 컬렉션 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ["bookmark-collections"],
      });

      // 해당 feedItem 상태 갱신
      queryClient.invalidateQueries({
        queryKey: ["feed-item-collections", variables.feedItemId],
      });
    },
  });
}
