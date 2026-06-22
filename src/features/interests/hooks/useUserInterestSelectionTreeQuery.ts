"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserInterestSelectionTreeAction } from "../actions/getUserInterestSelectionTreeAction";

export function useUserInterestSelectionTreeQuery() {
  return useQuery({
    queryKey: ["user-interests", "tree"],
    queryFn: async () => {
      const result = await getUserInterestSelectionTreeAction();
      if (!result.success) {
        throw new Error(
          result.error || "관심사 목록을 불러오는데 실패했습니다.",
        );
      }
      return result.data;
    },
  });
}
