"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInterestAction } from "../actions/createInterestAction";

export function useCreateInterestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterestAction,
    onSuccess: () => {
      // 1. 개별 관심사 목록 쿼리 무효화 (필요한 경우)
      queryClient.invalidateQueries({ queryKey: ["interests"] });

      // 2. 카테고리/관심사 통합 목록 쿼리 무효화 (현재 화면 갱신을 위해 필수!)
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}
