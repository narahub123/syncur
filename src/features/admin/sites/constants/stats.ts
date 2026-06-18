import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";

export const SITE_STATS_KEY = "site_stats_main";

export const getRssStatusList = (stats: SiteStatsDto) => [
  { label: "RSS 지원", value: stats.canRss, color: "green" },
  { label: "미지원", value: stats.noRss, color: "red" },
];
