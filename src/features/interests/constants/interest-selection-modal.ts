export const MIN_INTEREST_COUNT = 3;
export const MAX_INTEREST_COUNT = 10;

export const INTEREST_MODAL_TEXT = {
  TITLE: "관심사를 선택해주세요",
  DESCRIPTION: `관심사를 선택하면 더 관련성 높은 피드를 추천해드릴게요.
${MIN_INTEREST_COUNT}개 이상, 최대 ${MAX_INTEREST_COUNT}개까지 선택할 수 있어요.`,
} as const;

export const INTEREST_MODAL_ERROR_MESSAGE = {
  EXCEED: `관심사는 ${MAX_INTEREST_COUNT}개 이상 선택할 수 없습니다.`,
  INSUFFICIENT: `관심사를 ${MIN_INTEREST_COUNT}개 이상 선택해주세요.`,
};

export type InterestModalErrorCode = keyof typeof INTEREST_MODAL_ERROR_MESSAGE;
