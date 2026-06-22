import { ClientSession, Types } from "mongoose";
import { UserInterestModel } from "../models/UserInterest";
import { UserInterestLean } from "../types/user-interest-leans";
import { InterestSelectionDTO } from "../dtos/userInterestDto";

export class UserInterestRepository {
  /**
   * 사용자의 관심사 조회
   */
  async findByUserId(userId: string): Promise<UserInterestLean | null> {
    return await UserInterestModel.findOne({
      userId: new Types.ObjectId(userId),
    }).lean();
  }

  /**
   * 사용자 관심사 생성 또는 업데이트 (Upsert)
   * UI에서 사용자가 변경한 내용을 한 번에 저장할 때 유용합니다.
   */
  async upsert(
    userId: string,
    selections: InterestSelectionDTO[],
    session?: ClientSession,
  ): Promise<UserInterestLean> {
    // DTO 구조에 맞게 매핑 로직 수정
    const formattedSelections = selections.map((s) => ({
      categoryId: new Types.ObjectId(s.categoryId),
      // s.interests는 InterestDTO[]이므로, 각 객체의 _id를 추출
      interestIds: s.interestIds.map((id) => new Types.ObjectId(id)),
    }));

    const result = await UserInterestModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      {
        $set: {
          userId: new Types.ObjectId(userId),
          selections: formattedSelections,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        session,
      },
    )
      .lean<UserInterestLean>()
      .exec();

    if (!result) {
      throw new Error(
        "관심사 upsert 실패: 데이터 저장 중 오류가 발생했습니다.",
      );
    }

    return result;
  }

  /**
   * 사용자 관심사 삭제 (계정 탈퇴 등)
   */
  async deleteByUserId(
    userId: string,
    session?: ClientSession,
  ): Promise<boolean> {
    const result = await UserInterestModel.deleteOne(
      { userId: new Types.ObjectId(userId) },
      { session },
    );
    return result.deletedCount > 0;
  }

  /**
   * 특정 관심사를 선택한 사용자 수 집계 (통계용)
   */
  async countUsersByInterest(interestId: string): Promise<number> {
    return await UserInterestModel.countDocuments({
      "selections.interestIds": new Types.ObjectId(interestId),
    });
  }
}
