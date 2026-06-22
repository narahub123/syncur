import { userInterestRepository } from "../repositories/UserInterestRepository.instance";
import { categoryService } from "./CategoryService.instance";
import { interestService } from "./InterestService.instance";
import { UserInterestService } from "./UserInterestService";

export const userInterestService = new UserInterestService(
  userInterestRepository,
  categoryService,
  interestService,
);
