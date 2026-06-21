import { CategoryWithInterests } from "../dtos/categoryDto";
import { InterestDTO } from "../dtos/interestDto";

export const convertInterests = (
  interestIds: string[],
  categories: CategoryWithInterests[], // 전체 카테고리 목록을 인자로 추가
): InterestDTO[] => {
  const interestIdSet = new Set(interestIds);
  const interests: InterestDTO[] = [];

  // 모든 카테고리를 순회하며 관심사 매칭
  for (const category of categories) {
    for (const interest of category.interests) {
      if (interestIdSet.has(interest._id)) {
        interests.push(interest);
      }
    }
  }

  return interests;
};
