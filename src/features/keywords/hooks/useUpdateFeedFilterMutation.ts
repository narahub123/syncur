import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserKeywordSettingDocument } from "../models/UserKeywordSetting";
import { updateFeedFilterAction } from "../actions/updateFeedFilterAction";
import { userKeywordSettingQueryKey } from "../constants/queryKeys";

type UpdateFeedFilterResponse = UserKeywordSettingDocument;

export const useUpdateFeedFilterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFeedFilterAction,

    onSuccess: (updated: UpdateFeedFilterResponse) => {
      queryClient.setQueryData(
        userKeywordSettingQueryKey(),
        (old: UpdateFeedFilterResponse | undefined) => {
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
