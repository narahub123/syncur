import { updateUserInterestProfile } from "@/features/interests/repositories/userInterestProfileRepository";
import { connectMongo } from "@/shared/lib/db/mongoose";

type UpdateUserInterestProfileServiceParams = {
  userEmail: string;
  categoryIds: string[];
  interestIds: string[];
};

/**
 * 사용자 관심사 프로필을 저장하거나 수정한다.
 *
 * 사용 위치:
 * - 첫 로그인 관심사 온보딩
 * - 설정 페이지 관심사 수정
 *
 * 주의:
 * - 관심사 프로필만 변경한다.
 * - User의 온보딩 완료 여부는 변경하지 않는다.
 */
export async function updateUserInterestProfileService({
  userEmail,
  categoryIds,
  interestIds,
}: UpdateUserInterestProfileServiceParams) {
  await connectMongo();

  await updateUserInterestProfile({
    userEmail,
    categoryIds,
    interestIds,
  });
}
