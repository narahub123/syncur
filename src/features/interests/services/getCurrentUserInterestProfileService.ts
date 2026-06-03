import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { connectMongo } from "@/shared/lib/db/mongoose";

import { findUserInterestProfileByEmail } from "../repositories/userInterestProfileRepository";
import { Interest } from "../types/interests";
import { convertInterests } from "../lib/convertInterests";

/**
 * 현재 로그인한 사용자의 관심사 프로필을 조회한다.
 *
 * 처리 순서:
 * 1. 로그인 사용자 확인
 * 2. MongoDB 연결
 * 3. 사용자 이메일 기준 관심사 프로필 조회
 * 4. 설정 페이지에서 사용하기 쉬운 형태로 반환
 */
export const getCurrentUserInterestProfileService = async (): Promise<
  Interest[]
> => {
  const session = await requireAuth();

  const userEmail = session.user?.email;

  if (!userEmail) {
    throw new Error("사용자 이메일을 확인할 수 없습니다.");
  }

  await connectMongo();

  const profile = await findUserInterestProfileByEmail(userEmail);

  const interestIds = profile?.interestIds ?? [];

  return convertInterests(interestIds);
};
