import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";

export const FEED_EXECUTION_LOG_STATS_KEY = "feed_execution_log_stats_main";

export const getFeedExecutionLogStatusList = (
  stats: FeedExecutionLogStatsDto,
) => [{ label: "실패", value: stats.fails, color: "red" }];
