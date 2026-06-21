import { ClientSession, Types } from "mongoose";
import { UserInterestProfileModel } from "../models/UserInterestProfile";
import { UserInterestProfilePopulatedLean } from "../types/user-interest-profile-lean";

export class UserInterestProfileRepository {
  /**
   * 사용자 관심사 프로필 조회 (카테고리/관심사 데이터 포함)
   * * @param userId 사용자 ObjectId
   * @returns Populated된 Lean 객체
   */
  async findByUserId(
    userId: string,
  ): Promise<UserInterestProfilePopulatedLean | null> {
    return await UserInterestProfileModel.findOne({
      userId: new Types.ObjectId(userId),
    })
      .populate("categoryIds") // 실제 마스터 데이터 가져오기
      .populate("interestIds")
      .lean<UserInterestProfilePopulatedLean>()
      .exec();
  }

  /**
   * 사용자 관심사 프로필 생성/업데이트 (upsert)
   * * @param userId 사용자 ObjectId
   * @param categoryIds 선택한 카테고리 ID 목록 (string[])
   * @param interestIds 선택한 관심사 ID 목록 (string[])
   * @returns 업데이트된 프로필 (Populated 적용)
   */
  async updateProfile(params: {
    userId: string;
    categoryIds: string[];
    interestIds: string[];
    session?: ClientSession;
  }): Promise<UserInterestProfilePopulatedLean | null> {
    // 1. ID 문자열을 ObjectId로 변환
    const userIdObj = new Types.ObjectId(params.userId);
    const categoryIdsObj = params.categoryIds.map(
      (id) => new Types.ObjectId(id),
    );
    const interestIdsObj = params.interestIds.map(
      (id) => new Types.ObjectId(id),
    );

    // 2. Upsert 수행
    const updatedDoc = await UserInterestProfileModel.findOneAndUpdate(
      { userId: userIdObj },
      {
        $set: {
          categoryIds: categoryIdsObj,
          interestIds: interestIdsObj,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        session: params.session,
      },
    )
      .populate("categoryIds")
      .populate("interestIds")
      .lean<UserInterestProfilePopulatedLean>()
      .exec();

    return updatedDoc;
  }
}
