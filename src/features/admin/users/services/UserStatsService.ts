import { UserStatsDTO } from "@/features/admin/users/dto/UserStatsDTO";
import { UserStatsRepository } from "../repositories/UserStatsRepository";
import { toUserStatsDTO } from "@/features/admin/users/mappers/toUserStatsDTO";
import { UserStatsLean } from "../types/leans";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { UserService } from "@/features/users/services/UserService";
import { UserRepository } from "@/features/users/repositories/UserRepository";

export class UserStatsService {
  private repo: UserStatsRepository;
  private userRepository: AdminUserRepository;
  private userService: UserService;

  constructor() {
    this.repo = new UserStatsRepository();
    this.userRepository = new AdminUserRepository();
    this.userService = new UserService(new UserRepository());
  }

  /**
   * [내부 메서드] 데이터가 없는 날의 초기 상태를 이전 날짜 데이터를 기반으로 설정합니다.
   */
  private async ensureStatsInitialized(date: string): Promise<void> {
    const stats = await this.repo.findByDate(date);

    // 1. 문서가 아예 없거나, 초기화가 안 된 경우
    if (!stats || !stats.isSnapshotInitialized) {
      const yesterday = new Date(new Date(date).getTime() - 86400000)
        .toISOString()
        .split("T")[0];
      const lastStats = await this.repo.findByDate(yesterday);

      // 2. 어제 데이터가 있다면 어제 스냅샷을, 없다면 '전체 유저 수'를 가져옴
      let baseSnapshot = lastStats?.totalUsersSnapshot;

      if (baseSnapshot === undefined) {
        // 프로젝트 시작 후 첫 문서 생성인 경우: 전체 유저 수 카운트
        baseSnapshot = await this.userRepository.countAllUsers();
      }

      // 3. 값 반영 및 초기화 완료 표시
      await this.repo.setStats(date, {
        totalUsersSnapshot: baseSnapshot, // 스냅샷을 현재 유저 수로 맞춤
        isSnapshotInitialized: true,
      });
    }
  }

  /**
   * 관리자용: 특정 날짜의 통계 데이터를 조회합니다.
   */
  async getStatsByDate(date: string): Promise<UserStatsDTO | null> {
    const stats = await this.repo.findByDate(date);
    return stats ? toUserStatsDTO(stats) : null;
  }

  /**
   * 신규 가입 이벤트 발생 시 호출합니다.
   * 통계 테이블의 가입자 수와 누적 총계를 증가시킵니다.
   */
  async recordNewUser(date: string): Promise<void> {
    await this.ensureStatsInitialized(date);
    await this.repo.incrementNewUser(date);
  }

  /**
   * 사용자 탈퇴 이벤트 발생 시 호출합니다.
   * 통계 테이블의 탈퇴자 수를 증가시키고 누적 총계를 감소시킵니다.
   */
  async recordDeletedUser(date: string): Promise<void> {
    await this.ensureStatsInitialized(date);
    await this.repo.incrementDeletedUser(date);
  }

  /**
   * 사용자의 활동(Interaction) 발생 시 호출합니다.
   * $addToSet을 통해 고유 유저 ID를 기록하여 DAU를 관리합니다.
   */
  async recordActiveUser(date: string, userId: string): Promise<void> {
    await this.ensureStatsInitialized(date);
    await this.repo.addActiveUser(date, userId);
    await this.userService.updateLastActive(userId);
  }

  /**
   * [선택사항] 만약 수동으로 통계를 보정해야 할 경우 사용합니다.
   */
  async updateManualStats(
    date: string,
    stats: Partial<UserStatsLean>, // any 대신 사용
  ): Promise<void> {
    await this.repo.setStats(date, stats);
  }
}
