import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeBookmarkCollectionMapAction } from "../actions/removeBookmarkCollectionMapAction";

export function useRemoveBookmarkCollectionMapMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeBookmarkCollectionMapAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });

      queryClient.invalidateQueries({
        queryKey: ["bookmark-collections"],
      });
    },
  });
}
