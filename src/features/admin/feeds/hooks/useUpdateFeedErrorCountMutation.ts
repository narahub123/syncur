import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedErrorCount } from "../api/updateFeedErrorCount";

export function useUpdateFeedErrorCount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeedErrorCount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-feeds"],
      });
    },
  });
}
