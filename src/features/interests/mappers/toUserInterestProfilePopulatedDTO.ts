import { UserInterestProfilePopulatedDTO } from "../dtos/userInterestProfileDto";
import { UserInterestProfilePopulatedLean } from "../types/user-interest-profile-lean";
import { toCategoryDTOs } from "./toCategoryDTO";
import { toInterestDTOs } from "./toInterestDTO";

export const toUserInterestProfilePopulatedDTO = (
  item: UserInterestProfilePopulatedLean,
): UserInterestProfilePopulatedDTO => {
  return {
    _id: item._id.toString(),
    userId: item.userId.toString(),
    categories: toCategoryDTOs(item.categoryIds),
    interests: toInterestDTOs(item.interestIds),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
};

export const toUserInterestProfilePopulatedDTOs = (
  items: UserInterestProfilePopulatedLean[],
): UserInterestProfilePopulatedDTO[] =>
  items.map(toUserInterestProfilePopulatedDTO);
