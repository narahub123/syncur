import { UserStatsLean } from "@/features/admin/users/types/leans";
import { UserStatsModel } from "../../../users/models/UserStats";

export class UserStatsRepository {
  /**
   * 특정 날짜의 통계 데이터를 조회합니다.
   */
  async findByDate(date: string): Promise<UserStatsLean | null> {
    return await UserStatsModel.findOne({ date }).lean<UserStatsLean>();
  }

  /**
   * 신규 가입자 수를 +1 증가시킵니다.
   * totalUsersSnapshot(누적)도 함께 증가시켜 정확한 스냅샷을 유지합니다.
   */
  async incrementNewUser(date: string): Promise<void> {
    await UserStatsModel.updateOne(
      { date },
      {
        $inc: {
          newUsersCount: 1,
          totalUsersSnapshot: 1,
        },
      },
      { upsert: true },
    );
  }

  /**
   * 탈퇴자 수를 +1 증가시킵니다.
   * totalUsersSnapshot(누적)은 -1 감소시켜 현재 총 가입자 수를 보정합니다.
   */
  async incrementDeletedUser(date: string): Promise<void> {
    await UserStatsModel.updateOne(
      { date },
      {
        $inc: {
          deletedUsersCount: 1,
          totalUsersSnapshot: -1,
        },
      },
      { upsert: true },
    );
  }

  /**
   * 활성 사용자 ID를 배열에 추가합니다. (중복 방지: $addToSet)
   */
  async addActiveUser(date: string, userId: string): Promise<void> {
    await UserStatsModel.updateOne(
      { date },
      { $addToSet: { activeUsers: userId } },
      { upsert: true },
    );
  }

  /**
   * 기타 통계 필드를 덮어씌울 때 사용합니다. (전체 업데이트)
   */
  async setStats(
    date: string,
    updateData: Partial<UserStatsLean>,
  ): Promise<void> {
    await UserStatsModel.updateOne(
      { date },
      { $set: updateData },
      { upsert: true },
    );
  }
}
