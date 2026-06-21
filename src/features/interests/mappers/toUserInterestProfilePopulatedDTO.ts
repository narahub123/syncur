import { CategoryWithInterests } from "../dtos/categoryDto";
import { InterestDTO } from "../dtos/interestDto";
import { UserInterestProfilePopulatedDTO } from "../dtos/userInterestProfileDto";
import { UserInterestProfilePopulatedLean } from "../types/user-interest-profile-lean";
import { toInterestDTOs } from "./toInterestDTO";

export const toUserInterestProfilePopulatedDTO = (
  item: UserInterestProfilePopulatedLean,
): UserInterestProfilePopulatedDTO => {
  // 1. 관심사 DTO 생성
  const interestDTOs = toInterestDTOs(item.interestIds);

  // 2. 관심사를 카테고리 ID별로 그룹화 (매핑 최적화)
  const interestsByCategory = interestDTOs.reduce(
    (acc, interest) => {
      if (!acc[interest.categoryId]) {
        acc[interest.categoryId] = [];
      }
      acc[interest.categoryId].push(interest);
      return acc;
    },
    {} as Record<string, InterestDTO[]>,
  );

  // 3. 카테고리 DTO 생성 및 관심사 결합
  const categoriesWithInterests: CategoryWithInterests[] = item.categoryIds.map(
    (cat) => ({
      _id: cat._id.toString(),
      slug: cat.slug,
      name: cat.name,
      userCount: cat.userCount,
      createdAt: cat.createdAt.toISOString(),
      updatedAt: cat.updatedAt.toISOString(),
      // 매핑해둔 관심사 배열 할당 (없으면 빈 배열)
      interests: interestsByCategory[cat._id.toString()] || [],
    }),
  );

  return {
    _id: item._id.toString(),
    userId: item.userId.toString(),
    categories: categoriesWithInterests, // CategoryWithInterests[] 타입으로 반환
    interests: interestDTOs,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
};

export const toUserInterestProfilePopulatedDTOs = (
  items: UserInterestProfilePopulatedLean[],
): UserInterestProfilePopulatedDTO[] =>
  items.map(toUserInterestProfilePopulatedDTO);
