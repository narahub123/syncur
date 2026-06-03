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

/**
 * 이메일로 사용자 정보를 조회한다.
 *
 * 사용 목적:
 * - 현재 로그인한 사용자의 온보딩 완료 여부 확인
 * - 사용자별 데이터 조회의 기준점 확보
 *
 * @param email NextAuth session.user.email
 * @returns 조회된 사용자 문서. 없으면 null
 */
export async function findUserByEmail(email: string) {
  return User.findOne({ email });
}
