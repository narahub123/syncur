import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteInterestAction } from "../actions/deleteInterestAction";

export function useDeleteInterestMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInterestAction,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["interests"] });
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      }
    },
  });
}
