import { auth } from "@/auth";
import { USER_ROLE } from "@/features/users/constants/user-role";

/**
 * Admin 권한 가드
 *
 * 역할:
 * - 로그인 여부 확인
 * - 관리자 권한 확인
 * - 실패 시 redirect 처리
 */
export async function requireAdmin() {
  const session = await auth();

  // 1. 인증 체크
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  // 2. 권한 체크
  if (session.user.role !== USER_ROLE.ADMIN) {
    throw new Error("FORBIDDEN");
  }

  return session;
}
