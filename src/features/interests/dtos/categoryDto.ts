import { InterestDTO } from "./interestDto";

export interface CategoryDTO {
  _id: string;
  slug: string;
  name: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithInterests {
  interests: InterestDTO[];
  _id: string;
  slug: string;
  name: string;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryWithSelection extends Omit<
  CategoryWithInterests,
  "interests"
> {
  interests: (InterestDTO & { isSelected: boolean })[];
}