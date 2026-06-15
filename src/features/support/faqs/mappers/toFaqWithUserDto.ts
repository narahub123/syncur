import { FaqWithUserDto } from "../dtos";
import { FaqWithUserLean } from "../types/lean";

/**
 * FaqWithUserLean -> FaqWithUserDto 변환
 */
export const toFaqWithUserDto = (item: FaqWithUserLean): FaqWithUserDto => {
  return {
    _id: item._id.toString(),
    userId: item.userId.toString(),
    question: item.question,
    answer: item.answer,
    category: item.category,
    isPublished: item.isPublished,
    sortOrder: item.sortOrder,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    user: item.user
      ? {
          _id: item.user._id.toString(),
          name: item.user.name,
          email: item.user.email,
          image: item.user.image,
          role: item.user.role,
        }
      : null,
  };
};

/**
 * 배열 변환용 (Service에서 items 매핑 시 사용)
 */
export const toFaqWithUserDtoS = (
  items: FaqWithUserLean[],
): FaqWithUserDto[] => {
  return items.map(toFaqWithUserDto);
};
