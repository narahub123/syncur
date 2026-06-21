"use server";

import { interestService } from "@/features/interests/services/InterestService.instance";
import { interestSchema } from "../schemas/interest";

export async function createInterestAction(data: {
  slug: string;
  name: string;
  categoryId: string;
}) {
  const validated = interestSchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: "입력값이 올바르지 않습니다." };
  }

  try {
    const interest = await interestService.createInterest(validated.data);
    return { success: true, data: interest };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "관심사 생성 실패",
    };
  }
}
