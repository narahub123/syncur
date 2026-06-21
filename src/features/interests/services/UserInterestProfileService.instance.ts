import { userInterestProfileRepository } from "../repositories/UserInterestProfileRepository.instance";
import { categoryService } from "./CategoryService.instance";
import { interestService } from "./InterestService.instance";
import { UserInterestProfileService } from "./UserInterestProfileService";

export const userInterestProfileService = new UserInterestProfileService(
  userInterestProfileRepository,
  interestService,
  categoryService,
);
