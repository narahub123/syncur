import { UserRepository } from "../repositories/UserRepository";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { UserDto, UserDtoPagedResponse } from "../dto/userDto";
import { toUserDto, toUserDtos } from "../mappers/toUserDto";
import { ADMIN_CONFIG } from "@/features/admin/constants/admin-config";
import { PAGINATION } from "@/shared/constants/pagination";
import { AdminUsersQuery } from "@/features/admin/users/types/search";
import { USER_ROLE } from "../constants/user-role";
import { ImageInfo } from "@/shared/lib/cloudinary/image-info.model";
import { deleteCloudinaryImage } from "@/shared/lib/cloudinary/cloudinary.utils";

/**
 * User Service
 *
 * 사용자 도메인 비즈니스 로직 계층
 * - 온보딩 상태 처리
 * - 사용자 조회
 * - auth 관련 사용자 상태 관리
 */
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 이메일로 사용자 조회
   *
   * @param email 사용자 이메일
   * @returns UserDto | null
   */
  async getUserByEmail(email: string): Promise<UserDto | null> {
    await connectMongo();

    const lean = await this.userRepository.findByEmail(email);

    return lean ? toUserDto(lean) : null;
  }

  /**
   * 사용자 관심사 온보딩 완료 처리
   *
   * 처리 내용:
   * - onboardingCompleted = true
   * - onboardingCompletedAt = 현재 시간
   *
   * @param email 사용자 이메일
   * @returns 업데이트된 UserDto | null
   */
  async completeInterestOnboarding(email: string): Promise<UserDto | null> {
    const lean = await this.userRepository.completeInterestOnboarding(email);
    return lean ? toUserDto(lean) : null;
  }

  /**
   * 전체 사용자 목록 조회
   *
   * admin 페이지에서 사용자 리스트 출력용
   *
   * 특징:
   * - repository layer를 통해 DB 접근
   * - lean 기반 경량 조회
   */
  async getAllUsers(): Promise<UserDto[]> {
    const leans = await this.userRepository.findAll();
    return leans.map(toUserDto);
  }

  /**
   * ID로 사용자 조회
   *
   * @param userId 사용자 ObjectId
   * @returns UserDto | null
   */
  async getUserById(userId: string): Promise<UserDto | null> {
    const lean = await this.userRepository.findById(userId);
    return lean ? toUserDto(lean) : null;
  }

  /**
   * 사용자 권한(role) 변경
   *
   * @param userId 사용자 ObjectId
   * @param role 변경할 role (user | admin)
   * @returns 업데이트된 UserDto
   */
  async updateUserRole(
    userId: string,
    role: UserDto["role"],
  ): Promise<UserDto> {
    // 1. role 유효성 검증
    if (!Object.values(USER_ROLE).includes(role)) {
      throw new Error("Invalid role");
    }

    const lean = await this.userRepository.updateRole(userId, role);

    if (!lean) {
      throw new Error("User not found");
    }

    return toUserDto(lean);
  }

  /**
   * 사용자 목록 조회 (페이지네이션 + 검색)
   *
   * - admin 리스트용
   * - pagination meta 포함 응답 생성
   */
  async getUsersPaginated(
    query: AdminUsersQuery,
  ): Promise<UserDtoPagedResponse> {
    const page = query.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = query.limit ?? ADMIN_CONFIG.USERS.PAGINATION_LIMIT;

    const { items, totalCount } = await this.userRepository.findAllPaginated({
      page,
      limit,
      search: query.search,
      searchField: query.searchField,
      sort: query.sort,
      sortOrder: query.sortOrder,
    });

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

  /**
   * 관리자 목록 조회
   */
  async findAdmins(): Promise<UserDto[]> {
    const admins = await this.userRepository.findAdmins();

    return toUserDtos(admins);
  }

  async updateProfile(
    userId: string,
    data: { name: string; profileImage: ImageInfo | null },
  ): Promise<UserDto> {
    // 1. 현재 사용자 조회 (기존 프로필 이미지의 publicId를 알기 위해)
    const currentUser = await this.userRepository.findById(userId);

    // 2. DB 업데이트
    const updatedUser = await this.userRepository.updateProfile(userId, data);

    if (!updatedUser) {
      throw new Error("사용자 프로필 업데이트에 실패했습니다.");
    }
    // 3. 기존 이미지 삭제 (새 이미지로 변경되었고, 기존 이미지가 존재했다면)
    if (
      currentUser?.profileImage &&
      data.profileImage &&
      currentUser.profileImage.publicId !== data.profileImage.publicId
    ) {
      await deleteCloudinaryImage(currentUser.profileImage.publicId);
    }

    return toUserDto(updatedUser);
  }
}
