import { BugReportQuery } from "../types/search";

export const bugReportKeys = {
  // 1. 도메인 전체 최상위 루트 키 (모든 캐시의 부모)
  all: ["bugReports"] as const,

  // 2. 단건 상세 조회용 키 명세
  details: () => [...bugReportKeys.all, "detail"] as const,
  detail: (id: string) => [...bugReportKeys.details(), id] as const,

  // 3. 페이지네이션(테이블 UI) 목록 조회용 키 명세
  lists: () => [...bugReportKeys.all, "list"] as const,
  list: (params: BugReportQuery) => [...bugReportKeys.lists(), params] as const,

  // 4. 무한 스크롤(Infinite) 전용 키 명세
  infinite: () => [...bugReportKeys.all, "infinite"] as const,
};
