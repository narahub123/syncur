import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserKeywordSettingDocument } from "../models/UserKeywordSetting";
import { updateNotifyFilterAction } from "../actions/updateNotifyFilterAction";
import { userKeywordSettingQueryKey } from "../constants/queryKeys";

type UpdateNotifyFilterResponse = UserKeywordSettingDocument;

export const useUpdateNotifyFilterMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNotifyFilterAction,

    onSuccess: (updated: UpdateNotifyFilterResponse) => {
      queryClient.setQueryData(
        userKeywordSettingQueryKey(),
        (old: UpdateNotifyFilterResponse | undefined) => {
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
