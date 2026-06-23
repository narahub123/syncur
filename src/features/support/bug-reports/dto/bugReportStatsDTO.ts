export type BugReportStatsDTO = {
  total: number; // 총 버그 신고 개수
  completed: number; // 해결 완료 개수 (COMPLETED)
  pending: number; // 접수 대기 개수 (PENDING)
  checking: number; // [세분화 데이터] 확인 중 개수
  fixing: number; // [세분화 데이터] 수정 중 개수
};
