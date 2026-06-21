import { InterestDTO } from "../dtos/interestDto";
import { InterestLean } from "../types/interest-leans";

export const toInterestDTO = (item: InterestLean): InterestDTO => ({
  _id: item._id.toString(),
  slug: item.slug,
  name: item.name,
  categoryId: item.categoryId.toString(),
  userCount: item.userCount,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export const toInterestDTOs = (items: InterestLean[]): InterestDTO[] =>
  items.map(toInterestDTO);
