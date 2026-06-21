"use server";

import { connectMongo } from "@/shared/lib/db/mongoose";
import { requireAdmin } from "../../lib/requireAdmin";
import { adminUserService } from "../services/AdminUserService.instance";

export async function getUserByIdAction(userId: string) {
  try {
    await connectMongo();

    await requireAdmin();

    // 2. 사용자 정보 조회
    const result = await adminUserService.getUserDetailForAdmin(userId);

    if (!result) {
      throw new Error("USER_NOT_FOUND");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED")
        throw new Error("관리자 권한이 필요합니다.");
      if (error.message === "USER_NOT_FOUND")
        throw new Error("사용자를 찾을 수 없습니다.");
    }
    console.error("에러", error);
    throw new Error("사용자 정보를 가져오는 중 오류가 발생했습니다.");
  }
}
