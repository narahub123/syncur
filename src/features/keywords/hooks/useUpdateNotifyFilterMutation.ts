import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotifyFilterAction } from "../actions/updateNotifyFilterAction";
import { userKeywordSettingQueryKey } from "../constants/queryKeys";
import { UserKeywordSettingDto } from "../dto/userKeywordSettingDto";

export const useUpdateNotifyFilterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotifyFilterAction,

    onSuccess: (updated: UserKeywordSettingDto) => {
      queryClient.setQueryData(
        userKeywordSettingQueryKey(),
        (old: UserKeywordSettingDto | undefined) => {
          if (!old) return updated;

          return {
            ...old,
            defaultNotifyFilter: updated.defaultNotifyFilter,
          };
        },
      );
    },
  });
};
