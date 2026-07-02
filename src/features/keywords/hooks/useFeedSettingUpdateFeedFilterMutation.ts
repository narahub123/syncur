import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedFilterAction } from "../actions/updateFeedSettingFeedFilterAction";

export const useUpdateFeedFilterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeedFilterAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-feed-setting"],
      });
    },
  });
};
