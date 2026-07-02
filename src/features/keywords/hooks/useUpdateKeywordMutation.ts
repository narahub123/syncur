import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKeywordAction } from "../actions/updateKeywordAction";

export const useUpdateKeywordMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateKeywordAction,

    onSuccess: (_, variables) => {
      // 리스트 갱신
      queryClient.invalidateQueries({
        queryKey: ["keywords"],
      });

      // 상세 갱신 (있다면)
      queryClient.invalidateQueries({
        queryKey: ["keywords", "detail", variables.userKeywordId],
      });
    },
  });
};
