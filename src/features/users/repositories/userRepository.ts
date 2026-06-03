import User from "@/features/users/models/User";

type CompleteInterestOnboardingParams = {
  email: string;
};

/**
 * 사용자의 관심사 온보딩을 완료 상태로 변경한다.
 *
 * 사용 위치:
 * - 첫 로그인 관심사 저장 완료 후
 *
 * 주의:
 * - 이 repository는 User 컬렉션 DB 접근만 담당한다.
 * - 관심사 프로필 저장은 담당하지 않는다.
 */
export async function completeInterestOnboarding({
  email,
}: CompleteInterestOnboardingParams) {
  return User.updateOne(
    { email },
    {
      $set: {
        onboardingCompleted: true,
        onboardingCompletedAt: new Date(),
      },
    },
  );
}
