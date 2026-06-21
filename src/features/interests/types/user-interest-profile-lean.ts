import { Types } from "mongoose";
import { CategoryLean } from "./category-leans";
import { InterestLean } from "./interest-leans";

export interface UserInterestProfileLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  categoryIds: Types.ObjectId[];
  interestIds: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInterestProfilePopulatedLean {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  categoryIds: CategoryLean[]; // ObjectId 대신 Category 객체
  interestIds: InterestLean[]; // ObjectId 대신 Interest 객체
  createdAt: Date;
  updatedAt: Date;
}
