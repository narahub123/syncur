import { userInterestProfileService } from "./UserInterestProfileService.instance";
import { userService } from "@/features/users/services/UserService.instance";

type CompleteUserInterestOnboardingServiceParams = {
  userEmail: string;
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
  userEmail,
  categoryIds,
  interestIds,
}: CompleteUserInterestOnboardingServiceParams): Promise<void> {
  try {
    await userInterestProfileService.updateUserInterestProfile({
      userEmail,
      categoryIds,
      interestIds,
    });

    await userService.completeInterestOnboarding(userEmail);
  } catch (error) {
    console.error("[OnboardingService] 실패:", error);
    throw new Error("사용자 관심사 온보딩 처리에 실패했습니다.");
  }
}
