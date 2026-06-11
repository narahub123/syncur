import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedStatus } from "../api/updateFeedStatus";

export function useUpdateFeedStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeedStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-feeds"],
      });
    },
  });
}
