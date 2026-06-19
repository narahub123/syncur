import { AdminFeedExecutionLogsQuery } from "../types/search";
import { fetchAdminFeedExecutionLogs } from "../api/fetchAdminFeedExecutionLogs";
import { createInfiniteQuery } from "../../hooks/createInfiniteQuery";
import { FeedExecutionLogWithFeedAndSiteDto } from "@/features/feed-execution-logs/dto/feedExecutionLogDto";
import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";

export const useAdminFeedExecutionLogsInfiniteQuery = createInfiniteQuery<
  AdminFeedExecutionLogsQuery,
  FeedExecutionLogWithFeedAndSiteDto,
  FeedExecutionLogStatsDto
>("admin-execution-log-infinite", fetchAdminFeedExecutionLogs);
