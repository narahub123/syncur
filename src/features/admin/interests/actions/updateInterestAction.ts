"use server";

import { interestService } from "@/features/interests/services/InterestService.instance";
import { isDatabaseError } from "@/shared/error/isDatabaseError";

export async function updateInterestAction(
  id: string,
  data: { slug?: string; name?: string; categoryId?: string },
) {
  // 간단한 유효성 검사 (필요 시 더 정밀하게 구현 가능)
  if (!id) return { success: false, error: "ID가 필요합니다." };

  try {
    const updatedInterest = await interestService.updateInterest(id, data);
    return { success: true, data: updatedInterest };
  } catch (error: unknown) {
    if (isDatabaseError(error) && error.code === 11000) {
      return { success: false, error: "이미 사용 중인 Slug입니다." };
    }
    return { success: false, error: "관심사 수정 중 오류가 발생했습니다." };
  }
}
