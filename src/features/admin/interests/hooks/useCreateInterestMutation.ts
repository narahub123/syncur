"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInterestAction } from "../actions/createInterestAction";

export function useCreateInterestMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInterestAction,
    onSuccess: () => {
      // 관심사 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["interests"] });
    },
  });
}
