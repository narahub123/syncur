import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotifyFilterAction } from "../actions/updateFeedSettingNotifyFilterAction";

export const useUpdateNotifyFilterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotifyFilterAction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-feed-setting"],
      });
    },
  });
};
