"use server";

import { interestService } from "@/features/interests/services/InterestService.instance";
import { interestSchema } from "../schemas/interest"; // 스키마가 있다고 가정
import { isDatabaseError } from "@/shared/error/isDatabaseError";

export async function createInterestAction(data: {
  slug: string;
  name: string;
  categoryId: string;
}) {
  const validated = interestSchema.safeParse(data);
  if (!validated.success) return { success: false, error: "유효성 검사 실패" };

  try {
    const interest = await interestService.createInterest(validated.data);
    return { success: true, data: interest };
  } catch (error: unknown) {
    if (isDatabaseError(error) && error.code === 11000) {
      return { success: false, error: "이미 사용 중인 Slug입니다." };
    }
    return { success: false, error: "관심사 생성 실패" };
  }
}
