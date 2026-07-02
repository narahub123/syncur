import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserKeywordActiveAction } from "../actions/toggleUserKeywordActiveAction";

export const useToggleKeywordActiveMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleUserKeywordActiveAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keywords"],
      });
    },
  });
};
