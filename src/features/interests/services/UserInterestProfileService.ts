import mongoose from "mongoose";
import { UserInterestProfileRepository } from "../repositories/UserInterestProfileRepository";
import { UserInterestProfilePopulatedDTO } from "../dtos/userInterestProfileDto";
import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { toUserInterestProfilePopulatedDTO } from "../mappers/toUserInterestProfilePopulatedDTO";
import { InterestService } from "./InterestService";
import { CategoryService } from "./CategoryService";

/**
 * UserInterestProfile Service
 * - userId 기반 1:1 관계 관리
 * - populate된 데이터 제공
 */
export class UserInterestProfileService {
  constructor(
    private readonly userInterestProfileRepository: UserInterestProfileRepository,
    private readonly interestService: InterestService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * 사용자 관심사 프로필 조회 (DTO 반환)
   */
  async getProfileByUserId(
    userId: string,
  ): Promise<UserInterestProfilePopulatedDTO | null> {
    const profile =
      await this.userInterestProfileRepository.findByUserId(userId);
    if (!profile) return null;

    return toUserInterestProfilePopulatedDTO(profile);
  }

  /**
   * 현재 로그인한 사용자의 프로필 조회
   */
  async getCurrentUserProfile(): Promise<UserInterestProfilePopulatedDTO | null> {
    const session = await requireAuth();
    // 세션에서 userId를 가져온다고 가정 (구현에 따라 다를 수 있음)
    const userId = session.user?.id;

    if (!userId) {
      throw new Error("사용자 정보를 확인할 수 없습니다.");
    }

    return await this.getProfileByUserId(userId);
  }

  /**
   * 사용자 관심사 프로필 업데이트 (upsert)
   * Repository에서 populate된 데이터를 반환받아 DTO로 변환하여 반환
   */
  async updateUserInterestProfile(params: {
    userId: string;
    categoryIds: string[];
    interestIds: string[];
  }): Promise<UserInterestProfilePopulatedDTO> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. 기존 프로필 조회
      const oldProfile = await this.userInterestProfileRepository.findByUserId(
        params.userId,
      );

      // 2. 추가/삭제 대상 계산 (Set을 이용하면 편리합니다)
      const oldCategoryIds =
        oldProfile?.categoryIds.map((c) => c._id.toString()) || [];
      const oldInterestIds =
        oldProfile?.interestIds.map((i) => i._id.toString()) || [];

      const toAddCategoryIds = params.categoryIds.filter(
        (id) => !oldCategoryIds.includes(id),
      );
      const toRemoveCategoryIds = oldCategoryIds.filter(
        (id) => !params.categoryIds.includes(id),
      );

      const toAddInterestIds = params.interestIds.filter(
        (id) => !oldInterestIds.includes(id),
      );
      const toRemoveInterestIds = oldInterestIds.filter(
        (id) => !params.interestIds.includes(id),
      );

      // 3. 카운트 조정
      await Promise.all([
        this.categoryService.incrementUserCount(toAddCategoryIds, session),
        this.categoryService.decrementUserCount(toRemoveCategoryIds, session),
        this.interestService.incrementUserCount(toAddInterestIds, session),
        this.interestService.decrementUserCount(toRemoveInterestIds, session),
      ]);

      // 4. 프로필 업데이트
      const updated = await this.userInterestProfileRepository.updateProfile({
        ...params,
        session,
      });

      await session.commitTransaction();
      return toUserInterestProfilePopulatedDTO(updated!);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
