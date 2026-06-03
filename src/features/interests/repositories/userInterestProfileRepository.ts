import UserInterestProfile from "@/features/interests/models/UserInterestProfile";

type UpdateUserInterestProfileParams = {
  userEmail: string;
  categoryIds: string[];
  interestIds: string[];
};

/**
 * 사용자 관심사 프로필을 생성하거나 갱신한다.
 *
 * 사용 위치:
 * - 첫 로그인 관심사 온보딩
 * - 설정 페이지 관심사 수정
 *
 * 주의:
 * - 이 repository는 DB 접근만 담당한다.
 * - 온보딩 완료 여부는 User repository/service에서 처리한다.
 */
export async function updateUserInterestProfile({
  userEmail,
  categoryIds,
  interestIds,
}: UpdateUserInterestProfileParams) {
  return UserInterestProfile.updateOne(
    { userEmail },
    {
      $set: {
        categoryIds,
        interestIds,
      },
    },
    { upsert: true },
  );
}
