"use server";

import { requireAuth } from "@/shared/lib/auth/requireAuth";
import { userService } from "@/features/users/services/UserService.instance";
import { connectMongo } from "@/shared/lib/db/mongoose";

/**
 * 현재 로그인 사용자의 정보를 조회한다 (Action Layer)
 *
 * 책임:
 * - 인증 처리
 * - session → email 추출
 * - service 호출
 * - 에러를 사용자 의미 단위로 변환
 */
export async function getCurrentUserAction() {
  try {
    await connectMongo();

    const session = await requireAuth();

    const email = session.user?.email;

    if (!email) {
      throw new Error("AUTH_EMAIL_NOT_FOUND");
    }

    const user = await userService.getUserByEmail(email);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  } catch (error) {
    /**
     * 예상 가능한 에러는 의미 단위로 변환
     * - auth 문제
     * - user 없음
     * - 시스템 오류
     */
    if (error instanceof Error) {
      switch (error.message) {
        case "AUTH_EMAIL_NOT_FOUND":
          throw new Error("사용자 인증 정보를 확인할 수 없습니다.");

        case "USER_NOT_FOUND":
          throw new Error("사용자 정보를 찾을 수 없습니다.");

        default:
          console.error("[getCurrentUserAction] unexpected error:", error);
          throw new Error("사용자 정보를 조회하는 중 오류가 발생했습니다.");
      }
    }

    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
}
