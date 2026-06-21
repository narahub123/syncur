import mongoose from "mongoose";
import { userInterestProfileService } from "./UserInterestProfileService.instance";
import { userService } from "@/features/users/services/UserService.instance";

type CompleteUserInterestOnboardingServiceParams = {
  userId: string;
  categoryIds: string[];
  interestIds: string[];
};

/**
 * 사용자 관심사 온보딩 완료 처리
 *
 * 처리 흐름:
 * 1. 관심사 프로필 저장
 * 2. 사용자 온보딩 상태 업데이트
 *
 * 주의:
 * - 두 작업은 순차 실행되며 partial failure 가능성이 있음
 * - 실패 시 전체 온보딩은 미완료 상태로 간주
 */

export async function completeUserInterestOnboardingService({
  userId,
  categoryIds,
  interestIds,
}: CompleteUserInterestOnboardingServiceParams): Promise<void> {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await userInterestProfileService.updateUserInterestProfile({
      userId,
      categoryIds,
      interestIds,
      session,
    });

    await userService.completeInterestOnboarding(userId, session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
