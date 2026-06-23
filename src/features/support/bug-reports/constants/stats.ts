import { BugReportStatsDTO } from "../dto/bugReportStatsDTO";

export const BUG_REPORT_STATS_KEY = "bug_report_overview";

export const defaultBugReportStats: BugReportStatsDTO = {
  total: 0, // 총 버그 신고 개수
  completed: 0, // 해결 완료 개수 (COMPLETED)
  pending: 0, // 접수 대기 개수 (PENDING)
  checking: 0, // [세분화 데이터] 확인 중 개수
  fixing: 0, // [세분화 데이터] 수정 중 개수
};

export const getBugReportStatusList = (
  stats: BugReportStatsDTO = defaultBugReportStats,
) => [
  {
    label: "접수대기",
    value: stats.pending,
    color: "red", // 또는 "gray" (PENDING 상태)
  },
  {
    label: "확인중",
    value: stats.checking,
    color: "green", // (CHECKING 상태)
  },
  {
    label: "수정중",
    value: stats.fixing,
    color: "violet", // 또는 "yellow" (FIXING 상태)
  },
  {
    label: "해결완료",
    value: stats.completed,
    color: "blue", // 또는 "green" (COMPLETED 상태)
  },
];
