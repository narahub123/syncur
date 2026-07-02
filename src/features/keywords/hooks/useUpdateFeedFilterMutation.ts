import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedFilterAction } from "../actions/updateFeedFilterAction";
import { userKeywordSettingQueryKey } from "../constants/queryKeys";
import { UserKeywordSettingDto } from "../dto/userKeywordSettingDto";

export const useUpdateFeedFilterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeedFilterAction,

    onSuccess: (updated: UserKeywordSettingDto) => {
      queryClient.setQueryData(
        userKeywordSettingQueryKey(),
        (old: UserKeywordSettingDto | undefined) => {
          if (!old) return updated;

          return {
            ...old,
            defaultFeedFilter: updated.defaultFeedFilter,
          };
        },
      );
    },
  });
};
