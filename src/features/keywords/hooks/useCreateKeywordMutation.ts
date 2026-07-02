import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createKeywordAction } from "../actions/createKeywordAction";

export const useCreateKeywordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createKeywordAction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["keywords"],
      });
    },
  });
};
