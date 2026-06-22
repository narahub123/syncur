"use server";

import { userInterestService } from "@/features/interests/services/UserInterestService.instance";
import { requireAuth } from "@/shared/lib/auth/requireAuth";

export async function getUserInterestSelectionTreeAction() {
  try {
    const session = await requireAuth();

    const userId = session?.user?.id;
    if (!userId) throw new Error("인증되지 않은 사용자입니다.");

    const data = await userInterestService.getInterestSelectionTree(userId);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("관심사 선택 트리 조회 실패", error);
    return {
      success: false,
      error: "관심사 정보를 불러오는데 실패했습니다.",
    };
  }
}
