import { completeInterestOnboardingService } from "@/features/users/services/completeInterestOnboardingService";
import { updateUserInterestProfileService } from "@/features/interests/services/updateUserInterestProfileService";

type CompleteUserInterestOnboardingServiceParams = {
  userEmail: string;
  categoryIds: string[];
  interestIds: string[];
};

/**
 * 사용자 관심사 온보딩을 완료한다.
 *
 * 처리 내용:
 * 1. 사용자가 선택한 관심사 프로필을 저장한다.
 * 2. User의 관심사 온보딩 완료 상태를 true로 변경한다.
 *
 * 사용 위치:
 * - 첫 로그인 관심사 선택 모달 submit
 */
export async function completeUserInterestOnboardingService({
  userEmail,
  categoryIds,
  interestIds,
}: CompleteUserInterestOnboardingServiceParams) {
  await updateUserInterestProfileService({
    userEmail,
    categoryIds,
    interestIds,
  });

  await completeInterestOnboardingService({
    email: userEmail,
  });
}
