import { CategoryWithInterests } from "./categoryDto";
import { InterestDTO } from "./interestDto";

export interface UserInterestProfileDTO {
  _id: string;
  userstring: string;
  categorystrings: string[];
  intereststrings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInterestProfilePopulatedDTO {
  _id: string;
  userId: string; // userId (string)
  categories: CategoryWithInterests[];
  interests: InterestDTO[];
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}
