import { AdminDashboardStatsModel } from "../model/AdminDashboardStats";
import { AdminDashboardStats } from "../types/stats";

export class AdminDashboardRepository {
  /**
   * 대시보드 오버뷰 통계 데이터를 단건 조회합니다.
   * 데이터가 없을 경우 방어 코드를 위해 lean 객체 형식으로 반환합니다.
   */
  async findDashboardOverview(): Promise<AdminDashboardStats> {
    return await AdminDashboardStatsModel.findOne({
      key: "dashboard_overview",
    }).lean();
  }

  /**
   * (참고용) 수집 로그나 사이트 미들웨어에서 필드를 증가시킬 때 사용하는 공통 메서드
   */
  async incrementFields(incPayload: Record<string, number>): Promise<void> {
    await AdminDashboardStatsModel.updateOne(
      { key: "dashboard_overview" },
      { $inc: incPayload },
      { upsert: true },
    );
  }
}
