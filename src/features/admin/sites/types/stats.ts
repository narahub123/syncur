import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";
import { PaginatedResponse } from "@/shared/types/pagination";

export type DashboardResponse<T> = PaginatedResponse<T> & {
  stats: SiteStatsDto;
};
