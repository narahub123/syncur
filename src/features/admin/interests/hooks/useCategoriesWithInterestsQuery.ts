"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategoriesWithInterestsAction } from "../actions/getCategoriesWithInterestsAction";

export function useCategoriesWithInterestsQuery() {
  return useQuery({
    queryKey: ["categories", "with-interests"],
    queryFn: async () => {
      const result = await getCategoriesWithInterestsAction();

      // 서버 액션이 실패했을 때 에러를 throw하여 react-query의 onError가 작동하게 합니다.
      if (!result.success) {
        throw new Error(
          result.error ||
            "카테고리 및 관심사 데이터를 불러오는데 실패했습니다.",
        );
      }

      return result.data;
    },
  });
}
