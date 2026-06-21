import { AdminUsersQuery } from "../types/search";
import { UserDtoPagedResponse } from "@/features/users/dto/userDto";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { ADMIN_CONFIG } from "../../constants/admin-config";
import { toUserDto } from "@/features/users/mappers/toUserDto";
import { UserStatsService } from "./UserStatsService";
import { userStatsDefault } from "../constants/stats";
import { SubscriptionService } from "@/features/subscriptions/services/SubscriptionService";

export class AdminUserService {
  constructor(
    private readonly userRepository: AdminUserRepository,
    private readonly userStatsService: UserStatsService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  /**
   * 사용자 목록 조회 (페이지네이션 + 검색 + 필터)
   * + 오늘 통계 정보(stats)를 함께 반환합니다.
   */
  async getUsersPaginated(
    query: AdminUsersQuery,
  ): Promise<UserDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ?? ADMIN_CONFIG.USERS.PAGINATION_LIMIT;
    const today = new Date().toISOString().split("T")[0];

    // 1. 사용자 목록 조회와 오늘의 통계 조회를 병렬로 실행
    const [userResult, stats] = await Promise.all([
      this.userRepository.findAllPaginated(query),
      this.userStatsService.getStatsByDate(today),
    ]);

    const { items, totalCount } = userResult;
    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: items.map(toUserDto),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },

      // 2. 통계 데이터를 포함 (데이터가 없을 경우 0으로 초기화된 상태 반환)
      stats: stats ?? userStatsDefault(today),
    };
  }

  /**
   * 관리자용 사용자 상세 정보 조회
   * 유저 기본 정보와 구독 중인 피드 목록을 함께 가져옵니다.
   */
  async getUserDetailForAdmin(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    // 1. 유저 정보 조회
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    // 2. 구독 정보 조회 (SubscriptionService 활용)
    const subscriptions = await this.subscriptionService.getUserSubscriptions(
      userId,
      page,
      limit,
    );

    return {
      user: toUserDto(user),
      subscriptions,
    };
  }
}
