import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";

export const SITE_STATS_KEY = "site_stats_main";

export const getRssStatusList = (stats: SiteStatsDto) => [
  {
    label: "RSS",
    value: stats.rss,
    color: "green",
  },
  {
    label: "크롤링 가능",
    value: stats.crawlable,
    color: "blue",
  },
  {
    label: "미지원",
    value: stats.unavailable,
    color: "red",
  },
];

export const defaultSiteStats: SiteStatsDto = {
  total: 0,
  rss: 0,
  crawlable: 0,
  unavailable: 0,
};
