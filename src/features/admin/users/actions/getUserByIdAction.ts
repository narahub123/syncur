"use server";

import { userService } from "@/features/users/services/UserService.instance";
import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "../../lib/requireAdmin";

export async function getUserByIdAction(userId: string) {
  try {
    await connectMongo();

    await requireAdmin();

    // 2. 사용자 정보 조회
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    return user;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED")
        throw new Error("관리자 권한이 필요합니다.");
      if (error.message === "USER_NOT_FOUND")
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    throw new Error("사용자 정보를 가져오는 중 오류가 발생했습니다.");
  }
}
