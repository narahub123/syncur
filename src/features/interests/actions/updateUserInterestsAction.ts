"use server";

import { userInterestService } from "@/features/interests/services/UserInterestService.instance";
import { auth } from "@/auth";
import { InterestSelectionDTO } from "../dtos/userInterestDto";

interface UpdateInterestsPayload {
  selections: InterestSelectionDTO[];
}

export async function updateUserInterestsAction(
  payload: UpdateInterestsPayload,
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) throw new Error("인증되지 않은 사용자입니다.");

    const data = await userInterestService.updateUserInterests(
      userId,
      payload.selections,
    );

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("관심사 업데이트 실패", error);
    return {
      success: false,
      error: "관심사를 저장하는데 실패했습니다.",
    };
  }
}
