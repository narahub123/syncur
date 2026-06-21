import { INTEREST_CATEGORIES } from "../constants/interests";
import { InterestDTO } from "../dtos/interestDto";

export const convertInterests = (interestIds: string[]): InterestDTO[] => {
  const interestIdSet = new Set(interestIds);

  const interests: InterestDTO[] = [];

  for (const category of INTEREST_CATEGORIES) {
    for (const interest of category.interests) {
      if (interestIdSet.has(interest._id)) {
        interests.push(interest);
      }
    }
  }

  return interests;
};
