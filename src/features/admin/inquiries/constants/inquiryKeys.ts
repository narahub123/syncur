import { InquiryQuery } from "../types/search";

export const inquiryKeys = {
  // 1. 도메인 전체 최상위 루트 키 (모든 Inquiry 캐시의 부모)
  all: ["inquiries"] as const,

  // 2. 단건 상세 조회용 키 명세
  details: () => [...inquiryKeys.all, "detail"] as const,
  detail: (id: string) => [...inquiryKeys.details(), id] as const,

  // 3. 페이지네이션(테이블 UI) 목록 조회용 키 명세
  lists: () => [...inquiryKeys.all, "list"] as const,
  list: (params: InquiryQuery) => [...inquiryKeys.lists(), params] as const,

  // 4. 무한 스크롤(Infinite) 전용 키 명세
  infinite: () => [...inquiryKeys.all, "infinite"] as const,
};
