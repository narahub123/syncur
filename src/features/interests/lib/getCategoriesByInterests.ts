import { CategoryWithInterests } from "../dtos/categoryDto";

export const getCategoryIdsByInterestIds = (
  interestIds: string[],
  categories: CategoryWithInterests[], // 인자로 전체 카테고리 목록을 전달받아야 합니다.
): string[] => {
  // 선택된 관심사 ID를 Set으로 변환하여 검색 속도를 O(1)로 최적화
  const selectedInterestSet = new Set(interestIds);

  const categoryIds = categories
    .filter((category) =>
      // 카테고리 내의 관심사 중 선택된 ID가 하나라도 포함되어 있는지 확인
      category.interests.some((interest) =>
        selectedInterestSet.has(interest._id),
      ),
    )
    .map((category) => category._id); // 카테고리 ID 추출

  // 중복이 발생할 수 있다면 Array.from(new Set(categoryIds))를 반환하세요.
  return categoryIds;
};
