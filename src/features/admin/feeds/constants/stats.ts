import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";

export const FEED_STATS_KEY = "feed_stats_main";

export const getFeedStatusList = (stats: FeedStatsDto) => [
  { label: "활성화", value: stats.active, color: "green" },
  { label: "비활성화", value: stats.inactive, color: "red" },
];
