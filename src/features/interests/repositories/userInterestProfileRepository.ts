import { UserInterestProfileLean } from "@/shared/types/domain-leans";
import UserInterestProfile from "../models/UserInterestProfile";

/**
 * UserInterestProfile Repository
 *
 * 사용자 관심사 프로필 관련 DB 접근 계층
 * - 온보딩 관심사 저장/조회
 * - userEmail 기반 1:1 구조
 */
export class UserInterestProfileRepository {
  /**
   * 사용자 관심사 프로필 조회
   *
   * @param userEmail 사용자 이메일 (unique key)
   * @returns UserInterestProfileLean | null
   */
  async findByEmail(
    userEmail: string,
  ): Promise<UserInterestProfileLean | null> {
    return UserInterestProfile.findOne({ userEmail })
      .lean<UserInterestProfileLean>()
      .exec();
  }

  /**
   * 사용자 관심사 프로필 생성/업데이트 (upsert)
   *
   * - 존재하지 않으면 생성
   * - 존재하면 categoryIds, interestIds 갱신
   *
   * @param userEmail 사용자 이메일
   * @param categoryIds 선택한 카테고리 ID 목록
   * @param interestIds 선택한 관심사 ID 목록
   * @returns 업데이트된 UserInterestProfileLean
   */
  async updateProfile(params: {
    userEmail: string;
    categoryIds: string[];
    interestIds: string[];
  }): Promise<UserInterestProfileLean> {
    const result = await UserInterestProfile.findOneAndUpdate(
      { userEmail: params.userEmail },
      {
        $set: {
          categoryIds: params.categoryIds,
          interestIds: params.interestIds,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    )
      .lean<UserInterestProfileLean>()
      .exec();

    return result!;
  }
}
