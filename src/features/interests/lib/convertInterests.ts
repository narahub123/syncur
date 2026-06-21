import { InterestDTO } from "../dtos/interestDto";

export const convertInterests = (interestIds: string[]): InterestDTO[] => {
  const interestIdSet = new Set(interestIds);

  const interests: InterestDTO[] = [];

  // for (const category of []) {
  //   for (const interest of category.interests) {
  //     if (interestIdSet.has(interest._id)) {
  //       interests.push(interest);
  //     }
  //   }
  // }

  return interests;
};
