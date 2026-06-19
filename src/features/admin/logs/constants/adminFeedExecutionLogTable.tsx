import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { Column } from "../../types/admin-table";
import {
  AdminFeedExecutionLogSort,
  FEED_EXECUTION_ERROR_TYPE_KR,
  FEED_EXECUTION_REASON_KR,
  FEED_EXECUTION_STAGE_KR,
  FeedExecutionErrorType,
  FeedExecutionReason,
  FeedExecutionStage,
} from "../types/search";
import AdminFeedExecutionLogsStatusCell from "../components/AdminFeedExecutionLogsStatusCell";
import { Avatar } from "@/shared/components/common/Avartar";

export const adminFeedExecutionLogTableColumns: Column<
  FeedExecutionLogWithFeedAndSiteDto,
  AdminFeedExecutionLogSort
>[] = [
  {
    key: "siteName",
    header: "사이트",
    render: (log: FeedExecutionLogWithFeedAndSiteDto) => (
      <div className="flex items-center">
        {log.site?.faviconUrl && (
          <Avatar
            src={log.site?.faviconUrl}
            name={log.site?.name}
            imgProps={{ className: "rounded-full w-7 h-7" }}
          />
        )}
        <span className="max-w-36 truncate font-medium">
          {log.site?.name || "-"}
        </span>
      </div>
    ),
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
    sortable: true,
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
