import { AdminDashboardRepository } from "../repository/AdminDashboardRepository";
import { AdminDashboardStats } from "../types/stats";

export class AdminDashboardService {
  constructor(private readonly adminDashboardRepo: AdminDashboardRepository) {}

  /**
   * 대시보드 메인 화면 통합 통계 조회
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const rawStats = await this.adminDashboardRepo.findDashboardOverview();

    return {
      system: {
        sites: {
          total: rawStats?.sites?.total ?? 0,
          rss: rawStats?.sites?.rss ?? 0,
          crawlable: rawStats?.sites?.crawlable ?? 0,
          unavailable: rawStats?.sites?.unavailable ?? 0,
        },

        feeds: {
          total: rawStats?.feeds?.total ?? 0,
          active: rawStats?.feeds?.active ?? 0,
          inactive: rawStats?.feeds?.inactive ?? 0,
        },

        feedExecutionLogs: {
          total: rawStats?.feedExecutionLogs?.total ?? 0,
          fails: rawStats?.feedExecutionLogs?.fails ?? 0,
        },
      },

      user: {},

      cs: {
        bugReports: rawStats.bugReports ?? {
          total: 0,
          completed: 0,
          pending: 0,
          checking: 0,
          fixing: 0,
        },

        inquiries: rawStats.inquiries ?? {
          total: 0,
          pending: 0,
          processing: 0,
          completed: 0,
        },
      },
    };
  }
}
