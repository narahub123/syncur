import { UserInterestDTO } from "../dtos/userInterestDto";
import {
  UserInterestLean,
} from "../types/user-interest-leans";
import { toInterestSelectionDTOs } from "./toInterestSelectionDTO";

export const toUserInterestDTO = (
  userInterest: UserInterestLean,
): UserInterestDTO => ({
  _id: userInterest._id.toString(),
  userId: userInterest.userId.toString(),
  selections: toInterestSelectionDTOs(userInterest.selections),
  createdAt: userInterest.createdAt.toISOString(),
  updatedAt: userInterest.updatedAt.toISOString(),
});
