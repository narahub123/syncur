import { INTEREST_CATEGORIES } from "../constants/interests";

/**
 * 선택된 관심사 ID 목록으로부터
 * 해당 관심사가 속한 카테고리 ID 목록을 반환한다.
 *
 * 사용 예:
 * ["ai", "backend"]
 * →
 * ["tech"]
 *
 * 목적:
 * - 관심사 선택 결과를 기반으로 상위 카테고리를 계산한다.
 * - 관심사 저장 시 categoryIds 필드를 생성하는 데 사용한다.
 *
 * 동작 방식:
 * - 각 카테고리의 interests 목록을 순회한다.
 * - 선택된 interestIds 중 하나라도 포함되어 있으면
 *   해당 카테고리를 결과에 포함한다.
 */
export const getCategoryIdsByInterestIds = (interestIds: string[]) => {
  return INTEREST_CATEGORIES.filter((category) =>
    category.interests.some((interest) => interestIds.includes(interest._id)),
  ).map((category) => category.id);
};
