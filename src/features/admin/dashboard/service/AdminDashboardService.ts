import { AdminDashboardRepository } from "../repository/AdminDashboardRepository";
import { AdminDashboardStats } from "../types/stats";

export class AdminDashboardService {
  constructor(private readonly adminDashboardRepo: AdminDashboardRepository) {}

  /**
   * 대시보드 메인 화면에 뿌려줄 통합 통계 데이터를 조회합니다.
   * 유저 데이터가 완전히 제외된 [사이트, 피드, 수집 로그] 3대 위젯 전용 DTO 구조를 반환합니다.
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const rawStats = await this.adminDashboardRepo.findDashboardOverview();

    // DB에 도큐먼트가 아직 생성되지 않았을 때를 대비한 완벽한 기본값(Fallback) 매핑
    return {
      system: {
        sites: {
          total: rawStats?.system.sites?.total ?? 0,
          canRss: rawStats?.system.sites?.canRss ?? 0,
          noRss: rawStats?.system.sites?.noRss ?? 0,
        },
        feeds: {
          total: rawStats?.system.feeds?.total ?? 0,
          active: rawStats?.system.feeds?.active ?? 0,
          inactive: rawStats?.system.feeds?.inactive ?? 0,
        },
        feedExecutionLogs: {
          total: rawStats?.system.feedExecutionLogs?.total ?? 0,
          fails: rawStats?.system.feedExecutionLogs?.fails ?? 0,
        },
      },
      user: {},
      cs: {},
    };
  }
}
