"use server";

import { auth } from "@/auth";
import {
  INTEREST_MODAL_ERROR_MESSAGE,
  MAX_INTEREST_COUNT,
  MIN_INTEREST_COUNT,
  SAVE_USER_INTERESTS_ERROR_MESSAGE,
} from "../constants/interest-selection-modal";
import { completeUserInterestOnboardingService } from "../services/completeUserInterestOnboardingService";

type SaveUserInterestsActionInput = {
  selectedCategoryIds: string[];
  selectedInterestIds: string[];
};

type SaveUserInterestsActionResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

/**
 * 사용자가 선택한 관심사를 저장한다.
 *
 * 사용 위치:
 * - 첫 로그인 관심사 선택 모달 submit
 *
 * 처리 내용:
 * - 로그인 여부 확인
 * - 선택 개수 검증
 * - 관심사 저장 service 호출
 */
export async function saveUserInterestsAction({
  selectedCategoryIds,
  selectedInterestIds,
}: SaveUserInterestsActionInput): Promise<SaveUserInterestsActionResult> {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return {
      ok: false,
      message: "로그인이 필요합니다.",
    };
  }

  const categoryIds = selectedCategoryIds ?? [];
  const interestIds = selectedInterestIds ?? [];

  const totalSelectedCount = interestIds.length;

  if (totalSelectedCount < MIN_INTEREST_COUNT) {
    return {
      ok: false,
      message: INTEREST_MODAL_ERROR_MESSAGE.INSUFFICIENT,
    };
  }

  if (totalSelectedCount > MAX_INTEREST_COUNT) {
    return {
      ok: false,
      message: INTEREST_MODAL_ERROR_MESSAGE.EXCEED,
    };
  }

  try {
    await completeUserInterestOnboardingService({
      userEmail,
      categoryIds,
      interestIds,
    });

    return {
      ok: true,
    };
  } catch (error) {
    console.error("관심사 저장 실패", error);

    return {
      ok: false,
      message: SAVE_USER_INTERESTS_ERROR_MESSAGE,
    };
  }
}
