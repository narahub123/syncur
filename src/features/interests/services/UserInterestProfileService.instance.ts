import { userInterestProfileRepository } from "../repositories/UserInterestProfileRepository.instance";
import { UserInterestProfileService } from "./UserInterestProfileService";

export const userInterestProfileService = new UserInterestProfileService(
  userInterestProfileRepository,
);
