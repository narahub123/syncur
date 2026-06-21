"use server";

import { interestService } from "@/features/interests/services/InterestService.instance";
import { InterestDTO } from "@/features/interests/dtos/interestDto";

export async function getInterestsAction(filter?: {
  categoryId?: string;
  keyword?: string;
}): Promise<{
  success: boolean;
  data?: InterestDTO[];
  error?: string;
}> {
  try {
    // 1. 서비스 호출: filter 객체를 그대로 전달 (필터가 없으면 전체 조회)
    const interests = await interestService.getInterests(filter || {});

    // 2. 결과 반환
    return { success: true, data: interests };
  } catch (error) {
    console.error("관심사 목록 조회 실패:", error);

    // 3. 에러 처리
    return {
      success: false,
      error: "관심사 목록을 불러오는데 실패했습니다.",
    };
  }
}
