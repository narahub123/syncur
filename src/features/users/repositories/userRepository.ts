import User from "@/features/users/models/User";
import type { UserLean } from "@/shared/types/domain-leans";
import type { UserLeanPaagedResponse } from "../dto/userDto";
import {
  AdminUserSearchField,
  AdminUserSort,
} from "@/features/admin/users/types";
import { SortOrder } from "@/shared/types/pagination";

/**
 * User Repository
 *
 * 사용자 컬렉션 DB 접근 계층
 * - 온보딩 상태 업데이트
 * - 사용자 조회
 */
export class UserRepository {
  /**
   * 사용자의 관심사 온보딩 완료 처리
   *
   * 처리 내용:
   * - onboardingCompleted = true
   * - onboardingCompletedAt = 현재 시간
   *
   * @param email 사용자 이메일 (NextAuth 기준)
   */
  async completeInterestOnboarding(email: string): Promise<UserLean | null> {
    return User.findOneAndUpdate(
      { email },
      {
        $set: {
          onboardingCompleted: true,
          onboardingCompletedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )
      .lean<UserLean>()
      .exec();
  }

  /**
   * 이메일로 사용자 조회
   *
   * @param email 사용자 이메일
   * @returns User document | null
   */
  async findByEmail(email: string): Promise<UserLean | null> {
    return User.findOne({ email }).lean<UserLean>().exec();
  }

  /**
   * ID로 사용자 조회
   *
   * @param userId 사용자 ObjectId
   * @returns UserLean | null
   */
  async findById(userId: string): Promise<UserLean | null> {
    return User.findById(userId).lean<UserLean>().exec();
  }

  /**
   * 사용자 권한(role) 업데이트
   *
   * @param userId 사용자 ObjectId
   * @param role 변경할 role (user | admin)
   */
  async updateRole(
    userId: string,
    role: UserLean["role"],
  ): Promise<UserLean | null> {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: { role },
      },
      { returnDocument: "after" },
    )
      .lean<UserLean>()
      .exec();
  }

  /**
   * onboarding 상태만 조회 (가벼운 체크용)
   *
   * @param userId 사용자 ObjectId
   * @returns onboardingCompleted 여부
   */
  async getOnboardingStatus(userId: string): Promise<boolean | null> {
    const user = await User.findById(userId)
      .select("onboardingCompleted")
      .lean<{ onboardingCompleted: boolean }>()
      .exec();

    return user?.onboardingCompleted ?? null;
  }

  /**
   * 전체 사용자 목록 조회
   *
   * admin 페이지에서 사용자 리스트 출력용
   *
   * 특징:
   * - lean 사용으로 성능 최적화
   * - 필요한 필드만 선택
   */
  async findAll(): Promise<UserLean[]> {
    return User.find()
      .select(
        "name email image role onboardingCompleted onboardingCompletedAt createdAt",
      )
      .lean<UserLean[]>()
      .exec();
  }

  /**
   * 사용자 목록 조회 (페이지네이션 + 검색)
   *
   * - admin 리스트용
   * - email / name 기준 검색 지원
   */
  async findAllPaginated(params: {
    page: number;
    limit: number;
    search?: string;
    searchField?: AdminUserSearchField;
    sort?: AdminUserSort;
    sortOrder?: SortOrder;
  }): Promise<UserLeanPaagedResponse> {
    const {
      page,
      limit,
      search,
      searchField = "all",
      sort = "name",
      sortOrder = "desc",
    } = params;

    const skip = (page - 1) * limit;

    // 1. filter
    const filter =
      search && search.trim().length > 0
        ? searchField === "all"
          ? {
              $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
              ],
            }
          : {
              [searchField]: { $regex: search, $options: "i" },
            }
        : {};

    // 2. sort map

    const mongoOrder = sortOrder === "asc" ? 1 : -1;

    const sortMap = {
      name: { name: mongoOrder },
      email: { email: mongoOrder },
      role: { role: mongoOrder },
      onboarding: { onboardingCompleted: mongoOrder },
      createdAt: { createdAt: mongoOrder },
    } as const;

    const [items, totalCount] = await Promise.all([
      User.find(filter)
        .sort(sortMap[sort])
        .skip(skip)
        .limit(limit)
        .lean<UserLean[]>()
        .exec(),

      User.countDocuments(filter),
    ]);

    return {
      items,
      totalCount,
    };
  }
}
