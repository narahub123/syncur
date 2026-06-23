import { FeedExecutionLogStatsDto } from "@/features/feed-execution-logs/dto/feedExecutionLogStatsDto";
import { FeedStatsDto } from "@/features/feeds/dto/feedStatsDto";
import { SiteStatsDto } from "@/features/rss/site/dto/siteStatsDto";
import { BugReportStatsDTO } from "@/features/support/bug-reports/dto/bugReportStatsDTO";
import { InquiryStatsDTO } from "@/features/support/inquiries/dto/inquiryStatDTO";

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
  bugReports: BugReportStatsDTO;
  inquiries: InquiryStatsDTO;
}

export interface AdminDashboardStats {
  system: SystemSectionData;
  user: UserSectionData;
  cs: CsSectionData;
}
