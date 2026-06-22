import { Types } from "mongoose";
import { CategoryLean } from "./category-leans";
import { InterestLean } from "./interest-leans";

// selections 배열 내부의 객체에 대한 Lean 타입
export interface InterestSelectionLean {
  categoryId: Types.ObjectId;
  interestIds: Types.ObjectId[];
}

export interface UserInterestLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  selections: InterestSelectionLean[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InterestSelectionPopulatedLean {
  category: CategoryLean;
  interests: InterestLean[];
}
