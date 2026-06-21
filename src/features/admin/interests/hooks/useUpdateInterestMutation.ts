import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateInterestAction } from "../actions/updateInterestAction";

export const useUpdateInterestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof updateInterestAction>[1];
    }) => updateInterestAction(id, data),
    onSuccess: () => {
      // 1. 개별 관심사 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["interests"] });

      // 2. [필수] 카테고리/관심사 통합 목록 갱신 (CategoryListSection 반영)
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};
