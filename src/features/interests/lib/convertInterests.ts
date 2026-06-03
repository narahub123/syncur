import { INTEREST_CATEGORIES } from "../constants/interests";
import { Interest } from "../types/interests";

export const convertInterests = (interestIds: string[]): Interest[] => {
  const interestIdSet = new Set(interestIds);

  const interests: Interest[] = [];

  for (const category of INTEREST_CATEGORIES) {
    for (const interest of category.interests) {
      if (interestIdSet.has(interest.id)) {
        interests.push(interest);
      }
    }
  }

  return interests;
};
