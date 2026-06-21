import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategoryAction } from "../actions/createCategoryAction";

/**
 * 카테고리 생성 처리 Mutation
 */
export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategoryAction,
    onSuccess: () => {
      // 카테고리 목록 캐시 무효화
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}
