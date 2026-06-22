"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserInterestsAction } from "../actions/updateUserInterestsAction";

export function useUpdateUserInterestsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserInterestsAction,
    onSuccess: () => {
      // 성공 시, 관심사 트리 쿼리를 다시 불러와서 UI를 최신화
      queryClient.invalidateQueries({ queryKey: ["user-interests", "tree"] });
    },
  });
}
