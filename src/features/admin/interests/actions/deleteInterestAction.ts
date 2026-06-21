"use server";

import { interestService } from "@/features/interests/services/InterestService.instance";
import { isDatabaseError } from "@/shared/error/isDatabaseError";
import { revalidatePath } from "next/cache";

export async function deleteInterestAction(interestId: string) {
  try {
    await interestService.deleteInterest(interestId);

    revalidatePath("/admin/interests");
    return { success: true };
  } catch (error: unknown) {
    if (isDatabaseError(error)) {
      return {
        success: false,
        error: "관심사 삭제 중 데이터베이스 오류가 발생했습니다.",
      };
    }

    return {
      success: false,
      error: "관심사 삭제 중 알 수 없는 오류가 발생했습니다.",
    };
  }
}
