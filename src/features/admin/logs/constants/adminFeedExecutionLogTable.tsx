import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import {
  FEED_EXECUTION_ERROR_TYPE_KR,
  FEED_EXECUTION_REASON_KR,
  FEED_EXECUTION_STAGE_KR,
  FeedExecutionErrorType,
  FeedExecutionReason,
  FeedExecutionStage,
} from "@/features/feed-execution-logs/constants/feed-execution-log";
import { Column } from "../../types/admin-table";
import { AdminFeedExecutionLogSort } from "../types/search";
import AdminFeedExecutionLogsStatusCell from "../components/AdminFeedExecutionLogsStatusCell";

export const adminFeedExecutionLogTableColumns: Column<
  FeedExecutionLogWithFeedAndSiteDto,
  AdminFeedExecutionLogSort
>[] = [
  {
    key: "siteName",
    header: "사이트",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) => log.site?.name ?? "-",
  },
  {
    key: "status",
    header: "상태",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) => (
      <AdminFeedExecutionLogsStatusCell status={log.status} />
    ),
  },
  {
    key: "startedAt",
    header: "시작",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) =>
      new Date(log.startedAt).toLocaleString("ko-KR"),
  },
  {
    key: "finishedAt",
    header: "종료",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) =>
      log.finishedAt ? new Date(log.finishedAt).toLocaleString("ko-KR") : "-",
  },
  {
    key: "durationMs",
    header: "소요(ms)",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) => log.durationMs ?? "-",
  },
  {
    key: "errorType",
    header: "에러 타입",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) =>
      FEED_EXECUTION_ERROR_TYPE_KR[log.error?.type as FeedExecutionErrorType] ??
      "-",
  },
  {
    key: "failedAtStage",
    header: "단계",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) =>
      FEED_EXECUTION_STAGE_KR[log.failedAtStage as FeedExecutionStage] ?? "-",
  },
  {
    key: "reason",
    header: "사유",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) =>
      FEED_EXECUTION_REASON_KR[log.reason as FeedExecutionReason] ?? "-",
  },
] as const;
