import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { AdminFeedExecutionLogSort } from "../types";
import AdminFeedExecutionLogsStatusCell from "../components/AdminFeedExecutionLogsStatusCell";
import {
  FEED_EXECUTION_ERROR_TYPE_KR,
  FEED_EXECUTION_REASON_KR,
  FEED_EXECUTION_STAGE_KR,
  FeedExecutionErrorType,
  FeedExecutionReason,
  FeedExecutionStage,
} from "@/features/feed-execution-logs/constants/feed-execution-log";

export type AdminFeedExecutionLogTableColumn = {
  key: AdminFeedExecutionLogSort;
  header: string;
  align?: "left" | "center" | "right";
  render: (log: FeedExecutionLogWithFeedAndSiteDto) => React.ReactNode;
};

export const adminFeedExecutionLogTableColumns: AdminFeedExecutionLogTableColumn[] =
  [
    {
      key: "siteName",
      header: "사이트",
      align: "center",
      render: (log) => log.site?.name ?? "-",
    },

    {
      key: "status",
      header: "상태",
      render: (log) => <AdminFeedExecutionLogsStatusCell status={log.status} />,
    },

    {
      key: "startedAt",
      header: "시작",
      render: (log) => new Date(log.startedAt).toLocaleString("ko-KR"),
    },

    {
      key: "finishedAt",
      header: "종료",
      render: (log) =>
        log.finishedAt ? new Date(log.finishedAt).toLocaleString("ko-KR") : "-",
    },

    {
      key: "durationMs",
      header: "소요(ms)",
      align: "center",
      render: (log) => log.durationMs ?? "-",
    },

    {
      key: "errorType",
      header: "에러 타입",
      align: "center",
      render: (log) =>
        FEED_EXECUTION_ERROR_TYPE_KR[
          log.error?.type as FeedExecutionErrorType
        ] ?? "-",
    },

    {
      key: "failedAtStage",
      header: "단계",
      align: "center",
      render: (log) =>
        FEED_EXECUTION_STAGE_KR[log.failedAtStage as FeedExecutionStage] ?? "-",
    },

    {
      key: "reason",
      header: "사유",
      align: "center",
      render: (log) =>
        FEED_EXECUTION_REASON_KR[log.reason as FeedExecutionReason] ?? "-",
    },
  ];
