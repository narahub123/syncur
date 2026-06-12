import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { AdminFeedExecutionLogSort } from "../types";
import AdminFeedExecutionLogsStatusCell from "../components/AdminFeedExecutionLogsStatusCell";
import {
  FEED_EXECUTION_ERROR_TYPE_KR,
  FEED_EXECUTION_REASON_KR,
  FeedExecutionErrorType,
} from "@/features/feed-execution-logs/constants/feed-execution-log";

export type AdminFeedExecutionLogTableColumn = {
  key: AdminFeedExecutionLogSort;
  header: string;
  align?: "left" | "center" | "right";
  render: (log: FeedExecutionLogWithFeedAndSiteDto) => React.ReactNode;
};

export const adminFeedExecutionLogTableColumns: AdminFeedExecutionLogTableColumn[] =
  [
    /**
     * Site Name (primary sorting key)
     */
    {
      key: "siteName" as AdminFeedExecutionLogSort,
      header: "사이트",
      align: "center",
      render: (log) => log.site?.name ?? "-",
    },

    /**
     * Status
     */
    {
      key: "status",
      header: "상태",
      render: (log) => <AdminFeedExecutionLogsStatusCell status={log.status} />,
    },

    /**
     * Started At
     */
    {
      key: "startedAt",
      header: "시작",
      render: (log) => new Date(log.startedAt).toLocaleString("ko-KR"),
    },

    /**
     * Duration
     */
    {
      key: "durationMs",
      header: "소요(ms)",
      align: "center",
      render: (log) => log.durationMs ?? "-",
    },

    /**
     * Fetched Count
     */
    {
      key: "fetchedCount" as AdminFeedExecutionLogSort,
      header: "수집",
      align: "center",
      render: (log) => log.fetchedCount ?? 0,
    },

    /**
     * Inserted Count
     */
    {
      key: "insertedCount" as AdminFeedExecutionLogSort,
      header: "저장",
      align: "center",
      render: (log) => log.insertedCount ?? 0,
    },

    /**
     * Cache Hit
     */
    {
      key: "cacheHit",
      header: "캐시",
      align: "center",
      render: (log) => (log.cacheHit ? "HIT" : "MISS"),
    },

    /**
     * Execution ID (trace key)
     */
    {
      key: "errorType" as AdminFeedExecutionLogSort,
      header: "에러 타입",
      align: "center",
      render: (log) =>
        FEED_EXECUTION_ERROR_TYPE_KR[
          log.error?.type as FeedExecutionErrorType
        ] ?? "-",
    },

    /**
     * Failed Stage (debug 핵심)
     */
    {
      key: "failedAtStage" as AdminFeedExecutionLogSort,
      header: "단계",
      align: "center",
      render: (log) =>
        FEED_EXECUTION_ERROR_TYPE_KR[
          log.failedAtStage as FeedExecutionErrorType
        ] ?? "-",
    },
    /**
     * Reason
     */
    {
      key: "reason",
      header: "사유",
      align: "center",
      render: (log) => FEED_EXECUTION_REASON_KR[log.reason] ?? "-",
    },

    /**
     * HTTP Status (RSS fetch 결과)
     */
    {
      key: "httpStatus" as AdminFeedExecutionLogSort,
      header: "HTTP",
      align: "center",
      render: (log) => log.httpStatus ?? "-",
    },
  ];
