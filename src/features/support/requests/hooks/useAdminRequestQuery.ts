"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequestAction } from "../actions/getRequestAction";
import { requestKeys } from "../constants/requestKeys";

export function useAdminRequestQuery(requestId: string) {
  return useQuery({
    // 상세 조회는 ID를 키값으로 사용합니다.
    queryKey: requestKeys.adminDetail(requestId),
    queryFn: () => getRequestAction(requestId),
    // 문의 ID가 존재할 때만 실행
    enabled: !!requestId,
  });
}
