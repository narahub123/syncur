import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBookmarkCollectionAction } from "../actions/deleteBookmarkCollectionAction";

/**
 * 컬렉션 삭제 mutation
 */
export function useDeleteCollectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBookmarkCollectionAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark-collections"],
      });

      // 해당 컬렉션이 포함된 feed-item 상태도 갱신 필요 가능
      queryClient.invalidateQueries({
        queryKey: ["feed-item-collections"],
      });
    },
  });
}
