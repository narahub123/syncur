import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

import { findUserByEmail } from "../repositories/userRepository";

/**
 * 현재 로그인한 사용자를 조회한다.
 *
 * - requireAuth로 로그인 사용자를 보장한다.
 * - MongoDB 연결 후 email 기준으로 User 문서를 조회한다.
 * - 조회 실패 시 null을 반환해 호출부에서 안전하게 처리할 수 있게 한다.
 */
export async function getCurrentUserService() {
  try {
    const session = await requireAuth();

    const email = session.user?.email;

    if (!email) {
      return null;
    }

    await connectMongo();

    return await findUserByEmail(email);
  } catch (error) {
    console.error("현재 사용자 조회 실패", error);

    return null;
  }
}
