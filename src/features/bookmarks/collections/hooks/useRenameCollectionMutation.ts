import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameBookmarkCollectionAction } from "../actions/renameBookmarkCollectionAction";

/**
 * 컬렉션 이름 수정 mutation
 */
export function useRenameCollectionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: renameBookmarkCollectionAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark-collections"],
      });
    },
  });
}
