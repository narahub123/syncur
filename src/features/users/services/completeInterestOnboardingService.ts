import { completeInterestOnboarding } from "@/features/users/repositories/userRepository";
import { connectMongo } from "@/shared/lib/db/mongoose";

type CompleteInterestOnboardingServiceParams = {
  email: string;
};

/**
 * 사용자의 관심사 온보딩을 완료 처리한다.
 *
 * 사용 위치:
 * - 첫 로그인 관심사 저장 완료 후
 *
 * 주의:
 * - User의 온보딩 완료 상태만 변경한다.
 * - 관심사 프로필 저장은 담당하지 않는다.
 */
export async function completeInterestOnboardingService({
  email,
}: CompleteInterestOnboardingServiceParams) {
  await connectMongo();

  await completeInterestOnboarding({ email });
}
