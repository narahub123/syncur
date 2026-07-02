import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUserKeywordAction } from "../actions/deleteUserKeywordAction";

export const useDeleteKeywordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUserKeywordAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keywords"],
      });
    },
  });
};
