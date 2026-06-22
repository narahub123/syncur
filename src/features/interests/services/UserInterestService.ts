import { ClientSession, startSession } from "mongoose";
import { UserInterestRepository } from "../repositories/UserInterestRepository";
import { CategoryService } from "./CategoryService";
import { InterestService } from "./InterestService";
import { InterestSelectionDTO, UserInterestDTO } from "../dtos/userInterestDto";
import { toUserInterestDTO } from "../mappers/toUserInterestDTO";
import { CategoryWithSelection } from "../dtos/categoryDto";

export class UserInterestService {
  constructor(
    private userInterestRepo: UserInterestRepository,
    private categoryService: CategoryService,
    private interestService: InterestService,
  ) {}

  /**
   * 1. 사용자의 관심사 목록 조회
   */
  async getUserInterests(userId: string): Promise<UserInterestDTO | null> {
    const doc = await this.userInterestRepo.findByUserId(userId);
    if (!doc) throw new Error("사용자 관심사 조회 실패");
    return toUserInterestDTO(doc);
  }

  /**
   * 4. 사용자가 관심사를 추가/수정하기 위해 필요한 정보 조회
   */
  async getInterestSelectionTree(
    userId: string,
  ): Promise<CategoryWithSelection[]> {
    // categoryService 사용
    const allCategories =
      await this.categoryService.getAllCategoriesWithInterests();
    const userProfile = await this.userInterestRepo.findByUserId(userId);

    const selectedInterestIds = new Set(
      userProfile?.selections.flatMap((s) =>
        s.interestIds.map((id) => id.toString()),
      ) || [],
    );

    return allCategories.map((category) => ({
      ...category,
      interests: category.interests.map((interest) => ({
        ...interest,
        isSelected: selectedInterestIds.has(interest._id.toString()),
      })),
    }));
  }

  /**
   * 2. 사용자의 관심사 업데이트
   */
  async updateUserInterests(
    userId: string,
    selections: InterestSelectionDTO[],
  ): Promise<UserInterestDTO> {
    const session: ClientSession = await startSession();

    try {
      session.startTransaction();

      const current = await this.userInterestRepo.findByUserId(userId);

      // 1. 여기서 ObjectId들을 명시적으로 string으로 변환
      const oldIds =
        current?.selections.flatMap(
          (s) => s.interestIds.map((id) => id.toString()), // .toString() 추가
        ) || [];

      // 2. 입력받은 selections의 interestIds도 안전하게 string으로 처리
      const newIds = selections.flatMap(
        (s) => s.interestIds.map((id) => id), // .toString() 추가
      );

      const toIncrement = newIds.filter((id) => !oldIds.includes(id));
      const toDecrement = oldIds.filter((id) => !newIds.includes(id));

      if (toIncrement.length > 0) {
        await this.interestService.incrementUserCount(toIncrement, session);
      }
      if (toDecrement.length > 0) {
        await this.interestService.decrementUserCount(toDecrement, session);
      }

      const updatedProfile = await this.userInterestRepo.upsert(
        userId,
        selections,
        session,
      );

      await session.commitTransaction();
      return toUserInterestDTO(updatedProfile);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * 3. 사용자의 관심사 삭제
   */
  async deleteUserInterests(userId: string): Promise<boolean> {
    const session: ClientSession = await startSession();
    try {
      session.startTransaction();

      const current = await this.userInterestRepo.findByUserId(userId);
      if (current) {
        const allIds = current.selections.flatMap((s) =>
          s.interestIds.map((id) => id.toString()),
        );
        if (allIds.length > 0) {
          // interestService 사용
          await this.interestService.decrementUserCount(allIds, session);
        }
      }

      const success = await this.userInterestRepo.deleteByUserId(
        userId,
        session,
      );
      await session.commitTransaction();
      return success;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
