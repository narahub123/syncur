import User from "@/features/users/models/User";
import { UserLean } from "@/shared/types/domain-leans";

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
      { new: true },
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
}
