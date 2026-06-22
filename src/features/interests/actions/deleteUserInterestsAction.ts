"use server";

import { userInterestService } from "@/features/interests/services/UserInterestService.instance";
import { auth } from "@/auth";

export async function deleteUserInterestsAction() {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("인증되지 않은 사용자입니다.");

    const success = await userInterestService.deleteUserInterests(userId);

    return {
      success: true,
      data: success,
    };
  } catch (error) {
    console.error("관심사 삭제 실패", error);
    return {
      success: false,
      error: "관심사를 초기화하는데 실패했습니다.",
    };
  }
}
