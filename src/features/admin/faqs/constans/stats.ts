import { FaqStatsDto } from "../types/stats";

export const FAQ_STATS_KEY = "faq_stats_main";

export const getFaqStatusList = (stats: FaqStatsDto) => [
  {
    label: "전체 FAQ",
    value: stats.totalCount,
    color: "blue",
  },
  {
    label: "공개",
    value: stats.publishedCount,
    color: "green",
  },
  {
    label: "비공개",
    value: stats.hiddenCount,
    color: "red",
  },
];
