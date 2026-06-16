"use client";

import { useQuery } from "@tanstack/react-query";
import { getNoticeDetailAction } from "../actions/getNoticeDetailAction";

/**
 * 유저용 공지사항 상세 조회 쿼리 훅
 */
export function useNoticeDetailQuery(id: string) {
  return useQuery({
    queryKey: ["notice", id],
    queryFn: () => getNoticeDetailAction(id),
    enabled: !!id, // ID가 있을 때만 실행
  });
}
