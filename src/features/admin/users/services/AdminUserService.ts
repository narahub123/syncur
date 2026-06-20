import { AdminUsersQuery } from "../types/search";
import { UserDtoPagedResponse } from "@/features/users/dto/userDto";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminUserRepository } from "../repositories/AdminUserRepository";
import { ADMIN_CONFIG } from "../../constants/admin-config";
import { toUserDto } from "@/features/users/mappers/toUserDto";

export class AdminUserService {
  constructor(private readonly userRepository: AdminUserRepository) {}

  /**
   * 사용자 목록 조회 (페이지네이션 + 검색 + 필터)
   *
   * - admin 리스트용
   * - pagination meta 포함 응답 생성
   */
  async getUsersPaginated(
    query: AdminUsersQuery,
  ): Promise<UserDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ?? ADMIN_CONFIG.USERS.PAGINATION_LIMIT;

    const { items, totalCount } =
      await this.userRepository.findAllPaginated(query);

    const totalPages = Math.max(Math.ceil(totalCount / limit), 0);

    return {
      items: items.map(toUserDto),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    };
  }
}
