import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";

export interface SystemSectionData {
  sites: SiteStatsDto;
  feeds: FeedStatsDto;
  feedExecutionLogs: FeedExecutionLogStatsDto;
}

// 👥 UserSectionProps로 전달될 데이터 구조 (향후 확장성을 위해 구조만 유지)
export interface UserSectionData {
  user?: undefined;
}

// ⚙️ CsSectionProps로 전달될 데이터 구조
export interface CsSectionData {
  cs?: undefined;
}

export interface AdminDashboardStats {
  system: SystemSectionData;
  user: UserSectionData;
  cs: CsSectionData;
}
