import { CategoryDTO } from "../dtos/categoryDto";
import { CategoryLean } from "../types/category-leans";

export const toCategoryDTO = (item: CategoryLean): CategoryDTO => ({
  _id: item._id.toString(),
  slug: item.slug,
  name: item.name,
  userCount: item.userCount,
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export const toCategoryDTOs = (items: CategoryLean[]) => {
  return items.map(toCategoryDTO);
};
