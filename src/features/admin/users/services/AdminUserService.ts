import { AdminUsersQuery } from "../types/search";
import { UserDtoPagedResponse } from "@/features/users/dto/userDto";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { ADMIN_CONFIG } from "../../constants/admin-config";
import { toUserDto } from "@/features/users/mappers/toUserDto";
import { UserStatsService } from "./UserStatsService";
import { userStatsDefault } from "../constants/stats";

export class AdminUserService {
  constructor(
    private readonly userRepository: AdminUserRepository,
    private readonly userStatsService: UserStatsService,
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
}
