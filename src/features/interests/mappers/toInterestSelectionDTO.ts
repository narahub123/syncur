import { InterestSelectionDTO } from "../dtos/userInterestDto";
import { InterestSelectionLean } from "../types/user-interest-leans";

export const toInterestSelectionDTO = (
  item: InterestSelectionLean,
): InterestSelectionDTO => ({
  categoryId: item.categoryId.toString(),
  interestIds: item.interestIds.map((id) => id.toString()),
});

export const toInterestSelectionDTOs = (
  items: InterestSelectionLean[],
): InterestSelectionDTO[] => items.map(toInterestSelectionDTO);
